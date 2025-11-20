# Setup Guide - Professional Todo Application

This guide will walk you through setting up the Professional Todo Application from scratch.

## Step-by-Step Setup Instructions

### Prerequisites Check

Before starting, verify you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL installed and running
- ✅ A code editor (VS Code recommended)
- ✅ Terminal/Command Prompt access

---

## Setup Process

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- Next.js
- React
- TypeScript
- Prisma
- NextAuth.js
- TailwindCSS
- shadcn/ui components
- And more...

**Expected time:** 2-3 minutes

---

### Step 2: Create PostgreSQL Database

#### Option A: Using PostgreSQL CLI

```bash
# Create database
createdb todo_db

# Verify database exists
psql -l | grep todo_db
```

#### Option B: Using pgAdmin or Database GUI

1. Open your PostgreSQL GUI
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Name it: `todo_db`
5. Click "Save"

#### Option C: Using psql Terminal

```bash
psql -U postgres

CREATE DATABASE todo_db;
\l # List databases to verify
\q # Quit
```

---

### Step 3: Configure Environment Variables

#### Create .env file

```bash
# Copy the example file
cp .env.example .env
```

#### Edit .env file

Open `.env` in your editor and configure:

```env
# 1. DATABASE_URL
# Replace 'username' and 'password' with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db?schema=public"

# 2. NEXTAUTH_URL
# Keep as-is for local development
NEXTAUTH_URL="http://localhost:3000"

# 3. NEXTAUTH_SECRET
# Generate a secure random string (or use the command below)
NEXTAUTH_SECRET="your-super-secret-key-here"

# 4. Google OAuth (Optional - skip for now)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
```

#### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use this online: https://generate-secret.vercel.app/32
```

Copy the output and paste it as your `NEXTAUTH_SECRET`.

---

### Step 4: Set Up Database Schema

Run these commands in order:

```bash
# 1. Generate Prisma Client
npm run db:generate

# 2. Push schema to database (creates all tables)
npm run db:push

# 3. Seed database with sample data
npm run db:seed
```

**What this does:**
- Creates all database tables (User, Todo, Category, Tag, etc.)
- Generates TypeScript types from schema
- Adds sample data including a demo user

**Expected output:**
```
✅ Users created
✅ Categories created
✅ Tags created
✅ Todos created
✅ Shared todos created
✅ Activity logs created
🎉 Seeding completed successfully!

📧 Demo user credentials:
   Email: john@example.com
   Password: password123
```

---

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- info Loaded env from .env
✓ Ready in 2.5s
```

Open your browser and navigate to: **http://localhost:3000**

---

### Step 6: Test the Application

#### Login with Demo Account

1. You'll be redirected to the login page
2. Use these credentials:
   - **Email:** `john@example.com`
   - **Password:** `password123`
3. Click "Sign in"

#### Explore Features

After logging in, try:
- ✅ **View todos**: See pre-populated sample todos
- ➕ **Create a todo**: Click "New Todo" button
- ✏️ **Edit a todo**: Click the menu (⋮) on any todo
- ✅ **Complete a todo**: Click the checkbox
- 🗑️ **Delete a todo**: Move to trash
- 🔍 **Filter/Search**: Use the filter options
- 🌓 **Toggle theme**: Click your avatar → Switch theme
- 🗂️ **Browse sections**:
  - All Todos
  - Shared with me
  - Activity
  - Trash

---

## Verification Checklist

Before continuing development, verify:

- [ ] ✅ Application starts without errors
- [ ] ✅ Can access http://localhost:3000
- [ ] ✅ Can login with demo account
- [ ] ✅ Can create new todos
- [ ] ✅ Can edit existing todos
- [ ] ✅ Can delete and restore todos
- [ ] ✅ Theme toggle works
- [ ] ✅ All pages load (Todos, Shared, Activity, Trash)

---

## Troubleshooting

### Problem: "Database connection failed"

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql

   # Linux
   sudo systemctl status postgresql

   # Windows
   # Check Services app for "postgresql" service
   ```

2. Verify DATABASE_URL in `.env`:
   - Correct username and password
   - Correct database name (`todo_db`)
   - Correct port (default: 5432)

3. Test connection:
   ```bash
   psql -U your_username -d todo_db
   ```

---

### Problem: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: "Prisma Client not generated"

**Solution:**
```bash
npm run db:generate
```

---

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Find and kill process on port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or use a different port
PORT=3001 npm run dev
```

---

### Problem: Login fails with "Invalid credentials"

**Solution:**
1. Verify you're using the correct demo credentials
2. Check if database was seeded:
   ```bash
   npm run db:seed
   ```
3. If still failing, reset the database:
   ```bash
   npm run db:push -- --force-reset
   npm run db:seed
   ```

---

### Problem: "NEXTAUTH_SECRET not set"

**Solution:**
Make sure your `.env` file has:
```env
NEXTAUTH_SECRET="a-long-random-string-at-least-32-characters"
```

---

## Optional: Set Up Google OAuth

If you want to enable Google Sign-In:

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen
6. Add authorized origins:
   - `http://localhost:3000`
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
8. Copy Client ID and Client Secret

### 2. Update .env

```env
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Restart Server

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

Now you'll see "Sign in with Google" option on login page!

---

## Next Steps

Once setup is complete:

1. **Explore the Codebase**
   - Review `src/app` for page structure
   - Check `src/components` for UI components
   - Look at `src/lib/actions` for server actions

2. **Customize the Application**
   - Modify colors in `tailwind.config.ts`
   - Update branding in `layout.tsx`
   - Add new features

3. **Add Your Own Data**
   - Create new categories
   - Add custom tags
   - Build your todo workflow

4. **Deploy to Production**
   - See README.md for deployment instructions
   - Consider Vercel for easy deployment

---

## Database Management

### View Database in Prisma Studio

```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all tables
- Edit data directly
- Run queries
- Manage relationships

### Reset Database

If you need to start fresh:

```bash
# This will delete all data and recreate tables
npm run db:push -- --force-reset

# Then re-seed
npm run db:seed
```

### Create Database Backup

```bash
# Export database
pg_dump -U username todo_db > backup.sql

# Restore database
psql -U username todo_db < backup.sql
```

---

## Development Tips

### Hot Reload
Changes to code automatically refresh the browser. If not:
1. Check terminal for errors
2. Try hard refresh (Ctrl+Shift+R)
3. Restart dev server

### TypeScript Errors
If you see type errors:
```bash
# Regenerate Prisma types
npm run db:generate
```

### Styling Changes
TailwindCSS compiles automatically. If styles don't apply:
1. Check class names are correct
2. Verify `globals.css` is imported
3. Clear browser cache

---

## Support Resources

- **README.md** - Full documentation
- **GitHub Issues** - Report bugs
- **Next.js Docs** - https://nextjs.org/docs
- **Prisma Docs** - https://prisma.io/docs
- **shadcn/ui** - https://ui.shadcn.com

---

## Success! 🎉

You now have a fully functional todo application running locally!

**What you've accomplished:**
✅ Installed all dependencies
✅ Set up PostgreSQL database
✅ Configured environment variables
✅ Created database schema
✅ Seeded sample data
✅ Started development server
✅ Verified all features work

**Ready to build?** Start customizing the application to fit your needs!
