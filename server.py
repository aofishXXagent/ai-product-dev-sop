#!/usr/bin/env python3
"""
BMAD Workflow Site — local server
- Serves static files (index.html, app.js, data.js, styles.css)
- /api/chat   -> proxy to MiniMaxi M2 (loads key from .env)
- /api/config -> return non-secret config (model name, base url, has_key)

Run:
    python3 server.py
Then open http://localhost:8765
"""
import json
import os
import sys
import urllib.request
import urllib.error
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent.resolve()


def load_env():
    env_path = ROOT / ".env"
    env = {}
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


ENV = load_env()
API_KEY = ENV.get("MINIMAX_API_KEY", "")
BASE_URL = ENV.get("MINIMAX_BASE_URL", "https://api.minimaxi.com/v1/text/chatcompletion_v2")
MODEL = ENV.get("MINIMAX_MODEL", "MiniMax-M2")
PORT = int(ENV.get("PORT", "8765"))


CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))

    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/config":
            # Tells the frontend whether server has its own key (for "skip BYO" path)
            return self._send_json(200, {
                "server_has_key": bool(API_KEY),
                "server_model": MODEL if API_KEY else "",
                "server_base_url": BASE_URL if API_KEY else "",
            })
        self._serve_static()

    def _serve_static(self):
        path = self.path.split("?", 1)[0]
        if path == "/" or path == "":
            path = "/index.html"
        # prevent path traversal
        target = (ROOT / path.lstrip("/")).resolve()
        try:
            target.relative_to(ROOT)
        except ValueError:
            self.send_error(403, "Forbidden")
            return
        if not target.exists() or not target.is_file():
            self.send_error(404, "Not found: " + path)
            return
        ct = CONTENT_TYPES.get(target.suffix, "application/octet-stream")
        data = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ct)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path != "/api/chat":
            self.send_error(404, "Not found")
            return

        # Read user-provided overrides from request headers (BYO key)
        user_key = self.headers.get("X-API-Key", "").strip()
        user_url = self.headers.get("X-Base-URL", "").strip()
        user_model = self.headers.get("X-Model", "").strip()

        # Resolve effective config: user header > server .env
        effective_key = user_key or API_KEY
        effective_url = user_url or BASE_URL
        effective_model = user_model or MODEL

        if not effective_key:
            return self._send_json(400, {
                "error": "no_api_key",
                "message": "未配置 API Key。请在右侧设置面板配置你自己的 API,或在 .env 中配置 MINIMAX_API_KEY。"
            })

        length = int(self.headers.get("Content-Length", "0"))
        try:
            body = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        except json.JSONDecodeError as e:
            return self._send_json(400, {"error": "invalid json: " + str(e)})

        messages = body.get("messages")
        if not messages:
            return self._send_json(400, {"error": "messages required"})

        payload = {
            "model": effective_model,
            "messages": messages,
            "max_tokens": body.get("max_tokens", 4096),
            "temperature": body.get("temperature", 0.7),
            "stream": False,
        }

        req = urllib.request.Request(
            effective_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {effective_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                upstream = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            return self._send_json(e.code, {"error": "upstream_http_error", "status": e.code, "detail": e.read().decode("utf-8", "replace")[:600]})
        except Exception as e:
            return self._send_json(502, {"error": "upstream_error", "message": str(e)})

        # MiniMax-style error envelope: { base_resp: { status_code, status_msg } }
        base_resp = upstream.get("base_resp") or {}
        if base_resp and base_resp.get("status_code") not in (0, None):
            return self._send_json(400, {
                "error": "upstream_rejected",
                "message": base_resp.get("status_msg", "unknown upstream error"),
                "code": base_resp.get("status_code")
            })

        # Normalize OpenAI-compatible response
        choices = upstream.get("choices") or []
        if not choices:
            return self._send_json(502, {"error": "empty_choices", "raw_excerpt": json.dumps(upstream)[:500]})
        msg = choices[0].get("message", {}) or {}
        return self._send_json(200, {
            "content": msg.get("content", "") or "",
            "reasoning": msg.get("reasoning_content", "") or "",
            "finish_reason": choices[0].get("finish_reason"),
            "usage": upstream.get("usage", {}),
        })


def main():
    if not API_KEY:
        print("⚠️  WARNING: MINIMAX_API_KEY not set in .env — AI features will fail.", file=sys.stderr)
    print(f"\n  BMAD Workflow Site")
    print(f"  →  http://localhost:{PORT}")
    print(f"  →  model: {MODEL}")
    print(f"  →  static root: {ROOT}\n")
    print("  Ctrl+C 退出\n")
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  bye 👋")
        server.server_close()


if __name__ == "__main__":
    main()
