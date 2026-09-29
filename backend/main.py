"""
Portfolio contact API — Kalaivani P

POST /api/contact  ->  sends the submitted message to your inbox via Gmail SMTP.

Run locally:
    uvicorn main:app --reload --port 8000
"""

import logging
import os
import time
from collections import defaultdict, deque
from email.message import EmailMessage
from email.utils import formataddr
from html import escape

import aiosmtplib
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("portfolio-api")

# ── Configuration ────────────────────────────────────────────
EMAIL_USER = os.getenv("EMAIL_USER")  # Gmail address used to send
EMAIL_PASS = os.getenv("EMAIL_PASS")  # Gmail App Password (not your normal password)
EMAIL_TO = os.getenv("EMAIL_TO") or EMAIL_USER  # Inbox that receives messages
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

DEFAULT_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
extra_origins = [o.strip().rstrip("/") for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
ALLOWED_ORIGINS = DEFAULT_ORIGINS + extra_origins

# Simple in-memory rate limit: max N requests per IP per window
RATE_LIMIT = int(os.getenv("RATE_LIMIT", "5"))
RATE_WINDOW_SECONDS = int(os.getenv("RATE_WINDOW_SECONDS", "600"))
_requests: dict[str, deque] = defaultdict(deque)

app = FastAPI(title="Kalaivani P — Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    # Also allow Vercel preview deployments, e.g. https://portfolio-git-main-you.vercel.app
    allow_origin_regex=os.getenv("ALLOWED_ORIGIN_REGEX", r"https://.*\.vercel\.app"),
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


# ── Models ───────────────────────────────────────────────────
class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=5000)
    website: str | None = Field(default=None, max_length=200)  # honeypot — must stay empty

    @field_validator("name", "message")
    @classmethod
    def strip_and_require(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("must not be blank")
        return v

    @field_validator("name")
    @classmethod
    def single_line(cls, v: str) -> str:
        # Prevent header injection via the subject line
        return " ".join(v.split())


class ContactResponse(BaseModel):
    message: str


# ── Helpers ──────────────────────────────────────────────────
def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check_rate_limit(ip: str) -> None:
    now = time.monotonic()
    bucket = _requests[ip]
    while bucket and now - bucket[0] > RATE_WINDOW_SECONDS:
        bucket.popleft()
    if len(bucket) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many messages. Please try again later.")
    bucket.append(now)


def build_email(data: ContactRequest) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio contact from {data.name}"
    msg["From"] = formataddr(("Portfolio Contact", EMAIL_USER))
    msg["To"] = EMAIL_TO
    msg["Reply-To"] = formataddr((data.name, data.email))
    msg.set_content(f"New message from your portfolio\n\nName: {data.name}\nEmail: {data.email}\n\n{data.message}\n")

    msg.add_alternative(
        f"""\
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#0a0a0f;color:#fff;border-radius:12px">
  <h2 style="color:#00ffff;margin-top:0">New portfolio message</h2>
  <p><strong>Name:</strong> {escape(data.name)}</p>
  <p><strong>Email:</strong> <a style="color:#00ffff" href="mailto:{escape(data.email)}">{escape(data.email)}</a></p>
  <hr style="border:none;border-top:1px solid #333">
  <p style="white-space:pre-wrap;line-height:1.6">{escape(data.message)}</p>
</div>""",
        subtype="html",
    )
    return msg


# ── Routes ───────────────────────────────────────────────────
@app.get("/")
async def health():
    return {"status": "ok", "email_configured": bool(EMAIL_USER and EMAIL_PASS)}


@app.post("/api/contact", response_model=ContactResponse)
async def contact(data: ContactRequest, request: Request):
    # Bots fill the hidden field: pretend success, send nothing
    if data.website:
        logger.info("Honeypot triggered; message dropped")
        return {"message": "Email sent successfully!"}

    check_rate_limit(client_ip(request))

    if not (EMAIL_USER and EMAIL_PASS):
        logger.error("EMAIL_USER / EMAIL_PASS are not configured")
        raise HTTPException(status_code=500, detail="Email service is not configured.")

    try:
        await aiosmtplib.send(
            build_email(data),
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            start_tls=True,
            username=EMAIL_USER,
            password=EMAIL_PASS,
            timeout=20,
        )
    except Exception:
        logger.exception("Failed to send contact email")
        raise HTTPException(status_code=500, detail="Failed to send email. Please try again later.")

    logger.info("Contact email sent")
    return {"message": "Email sent successfully!"}
