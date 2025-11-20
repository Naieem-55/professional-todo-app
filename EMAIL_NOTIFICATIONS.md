# Email Notifications Setup Guide

This guide explains how to set up email notifications for overdue tasks in your Todo application.

## Features

✅ **Automatic email notifications** when tasks become overdue
✅ **Beautiful HTML email templates** with task details
✅ **Multiple email service options** (Resend or SMTP)
✅ **Secure cron job** with token authentication
✅ **Activity logging** for all sent notifications

---

## Setup Options

Choose one of two email services:

### Option 1: Resend (Recommended)

**Pros:**
- ✅ Modern, simple API
- ✅ Free tier: 100 emails/day
- ✅ Easy setup (just API key)
- ✅ Great deliverability

**Setup:**
1. Go to https://resend.com and create an account
2. Get your API key from the dashboard
3. Verify your domain (or use their test domain for development)

### Option 2: SMTP (Gmail, Outlook, etc.)

**Pros:**
- ✅ Works with any email provider
- ✅ Free with existing email account
- ✅ Familiar setup

**Setup:**
Use your existing email provider's SMTP settings

---

## Configuration

### Step 1: Install Dependencies

```bash
npm install
```

The following packages are already added to `package.json`:
- `resend` - Resend API client
- `nodemailer` - SMTP email client
- `node-cron` - Task scheduler

### Step 2: Configure Environment Variables

Edit your `.env` file:

#### Option A: Using Resend

```env
# Email Service
EMAIL_SERVICE="resend"
RESEND_API_KEY="re_123456789"
EMAIL_FROM="Todo App <noreply@yourdomain.com>"

# Cron Security
CRON_SECRET="your-random-secret-token-12345"
```

#### Option B: Using Gmail SMTP

```env
# Email Service
EMAIL_SERVICE="smtp"
EMAIL_FROM="Your Name <your.email@gmail.com>"

# Gmail SMTP Settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your.email@gmail.com"
SMTP_PASSWORD="your-app-password"  # See instructions below

# Cron Security
CRON_SECRET="your-random-secret-token-12345"
```

**Gmail App Password:**
1. Go to Google Account settings
2. Security → 2-Step Verification (enable it)
3. App passwords → Generate new app password
4. Use that password in `SMTP_PASSWORD`

#### Option C: Using Other SMTP Providers

**Outlook/Office365:**
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
```

**SendGrid:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
```

---

## Setting Up the Cron Job

The email notifications need to run on a schedule. Here are the options:

### Option 1: Vercel Cron (Production - Easiest)

If deploying to Vercel, create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-overdue",
      "schedule": "0 9 * * *"
    }
  ]
}
```

This runs every day at 9 AM UTC.

**No additional setup needed!** Vercel automatically calls your API route.

### Option 2: External Cron Service (Any Hosting)

Use a free service like:
- **cron-job.org** (free, reliable)
- **EasyCron** (free tier available)
- **Uptime Robot** (free HTTP monitoring)

**Setup:**
1. Create account on cron-job.org
2. Add new cron job:
   - **URL:** `https://your-domain.com/api/cron/check-overdue`
   - **Schedule:** `0 9 * * *` (daily at 9 AM)
   - **HTTP Header:** `Authorization: Bearer your-cron-secret-token`

### Option 3: Node-Cron (Local Development)

Create `src/app/api/cron-runner/route.ts`:

```typescript
import cron from 'node-cron'
import { checkAndSendOverdueNotifications } from '@/lib/notifications'

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running scheduled task check...')
  await checkAndSendOverdueNotifications()
})
```

**Note:** This only works while your dev server is running.

### Option 4: System Cron (Linux/Mac)

Add to crontab:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 9 AM)
0 9 * * * curl -H "Authorization: Bearer your-cron-secret" https://your-domain.com/api/cron/check-overdue
```

---

## Testing Email Notifications

### Manual Test via API

You can manually trigger the notification check:

```bash
# Using curl
curl -X POST http://localhost:3000/api/cron/check-overdue \
  -H "Authorization: Bearer your-cron-secret"

# Or using browser/Postman
POST http://localhost:3000/api/cron/check-overdue
Header: Authorization: Bearer your-cron-secret
```

### Test with Development Data

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Create a test todo with an overdue date:
   - Go to http://localhost:3000
   - Create a new todo
   - Set due date to yesterday
   - Save it

3. Trigger the notification check:
   ```bash
   curl -X POST http://localhost:3000/api/cron/check-overdue \
     -H "Authorization: Bearer your-cron-secret"
   ```

4. Check your email inbox!

---

## Email Template Preview

The notification emails include:

- **Beautiful gradient header** with icon
- **Task details card** with priority color coding
- **Task title and description**
- **Priority badge** (Low/Medium/High)
- **Overdue date** in red
- **Call-to-action button** linking to the task
- **Responsive design** (mobile-friendly)

---

## How It Works

1. **Cron job runs** at scheduled time (e.g., 9 AM daily)
2. **API route is called** (`/api/cron/check-overdue`)
3. **System queries database** for overdue, incomplete tasks
4. **For each overdue task:**
   - Gets user's email
   - Generates HTML email from template
   - Sends email via Resend or SMTP
   - Logs activity in database
5. **Returns summary** of emails sent

---

## Customization

### Change Email Template

Edit `src/lib/email.ts` → `getOverdueTaskEmailHtml()` function

### Change Notification Frequency

Edit the cron schedule:
- `0 9 * * *` - Daily at 9 AM
- `0 9,17 * * *` - Twice daily (9 AM & 5 PM)
- `0 * * * *` - Every hour
- `*/30 * * * *` - Every 30 minutes

### Add More Notification Types

1. Edit `src/lib/notifications.ts`
2. Create new functions like `sendUpcomingDueNotifications()`
3. Add new API routes
4. Schedule additional cron jobs

---

## Troubleshooting

### Emails Not Sending

1. **Check environment variables:**
   ```bash
   echo $RESEND_API_KEY
   # or
   echo $SMTP_PASSWORD
   ```

2. **Check logs:**
   - Look at terminal output when cron runs
   - Check for error messages

3. **Test email service:**
   ```bash
   # Send test email
   curl -X POST http://localhost:3000/api/cron/check-overdue \
     -H "Authorization: Bearer your-cron-secret"
   ```

4. **Verify email credentials:**
   - Resend: Check API key is valid
   - SMTP: Test with email client

### Cron Job Not Running

1. **Check cron schedule syntax:**
   - Use https://crontab.guru to validate

2. **Verify authorization:**
   - Ensure `CRON_SECRET` matches in both `.env` and cron configuration

3. **Check Vercel deployment:**
   - Ensure `vercel.json` is in root directory
   - Redeploy after adding cron configuration

### Gmail SMTP Issues

1. **Enable 2-Factor Authentication**
2. **Generate App Password** (not your regular password)
3. **Allow less secure apps** (if not using app password)

---

## Production Deployment

### Vercel

1. Add environment variables in Vercel dashboard:
   - `EMAIL_SERVICE`
   - `RESEND_API_KEY` (or SMTP settings)
   - `EMAIL_FROM`
   - `CRON_SECRET`

2. Add `vercel.json` with cron configuration

3. Deploy:
   ```bash
   vercel --prod
   ```

### Other Platforms

1. Set environment variables
2. Deploy application
3. Set up external cron service (cron-job.org)
4. Configure cron to call your API endpoint

---

## Security Notes

✅ **Cron endpoint is protected** with `CRON_SECRET`
✅ **Email service credentials** stored in environment variables
✅ **No sensitive data** in email templates
✅ **Rate limiting recommended** for production

---

## Cost Estimates

### Resend (Recommended)
- **Free tier:** 3,000 emails/month
- **Pro:** $20/month for 50,000 emails
- **Perfect for:** Most applications

### SMTP (Gmail)
- **Free:** Included with Google account
- **Limit:** 500 emails/day (2,000/day for Workspace)
- **Perfect for:** Small projects

---

## Summary

✅ Email notifications are fully set up and configured
✅ Choose between Resend (modern) or SMTP (traditional)
✅ Secure API endpoint with token authentication
✅ Beautiful HTML email templates
✅ Easy to test and customize
✅ Production-ready with Vercel Cron or external services

**Next Steps:**
1. Choose email service (Resend or SMTP)
2. Add credentials to `.env`
3. Set up cron job
4. Test with manual trigger
5. Deploy to production

---

For questions or issues, check the main README.md or create a GitHub issue.
