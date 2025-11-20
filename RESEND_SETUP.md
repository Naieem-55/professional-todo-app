# Resend Email Setup Guide

## Quick Start (Testing)

### Step 1: Verify Your Email in Resend

1. Go to https://resend.com/emails
2. Click **"Add Email"** or go to Settings → API Keys
3. Verify your email address (naieemislam27@gmail.com)
4. Use this verified email for testing

### Step 2: Update .env for Testing

```env
EMAIL_FROM="onboarding@resend.dev"
```

**Note:** `onboarding@resend.dev` is Resend's testing domain. It works immediately without verification!

### Step 3: Test Again

```bash
curl -X POST http://localhost:3000/api/cron/check-overdue \
  -H "Authorization: Bearer test123"
```

---

## Production Setup (Custom Domain)

### Step 1: Add Your Domain to Resend

1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)

### Step 2: Add DNS Records

Resend will give you DNS records to add:
- SPF record
- DKIM record
- DMARC record (optional)

Add these to your domain's DNS settings (GoDaddy, Cloudflare, etc.)

### Step 3: Wait for Verification

- Usually takes 15-60 minutes
- Check status in Resend dashboard

### Step 4: Update .env

```env
EMAIL_FROM="Todo App <noreply@yourdomain.com>"
```

---

## Alternative: Use Gmail SMTP

If you want to send emails immediately without domain verification:

### Update .env

```env
# Use Gmail instead of Resend
EMAIL_SERVICE="smtp"
EMAIL_FROM="Naieem <naieemislam27@gmail.com>"

# Gmail SMTP Settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="naieemislam27@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"
```

### Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already)
3. Go to **App Passwords**
4. Generate password for "Mail" on "Windows Computer"
5. Copy the 16-character password
6. Use it in `SMTP_PASSWORD`

---

## Troubleshooting

### Emails Not Received?

1. **Check spam folder** 📧
2. **Verify email address in Resend**
3. **Use testing domain** (`onboarding@resend.dev`)
4. **Check Resend logs** at https://resend.com/emails

### Still Not Working?

Switch to Gmail SMTP - it works instantly!
