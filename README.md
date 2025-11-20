# Professional Todo Application

A complete, production-quality todo application built with Next.js 14, React, TypeScript, TailwindCSS, Prisma, and PostgreSQL.

## Features

### Core Features ✅
- ✨ Create, update, delete todos
- ✅ Mark todo complete/incomplete
- 📅 Add due dates
- 🎯 Priority levels (Low, Medium, High)
- 🏷️ Tags and categories
- 📝 Subtasks
- 📄 Rich text descriptions
- 🔍 Advanced search & filtering
- 📱 Fully responsive (mobile-first design)
- 🌓 Dark & light theme
- ⌨️ Keyboard shortcuts

### Advanced Features ✅
- 🔐 User authentication (Email + Google OAuth)
- 👥 Multi-user support
- 🔄 Real-time updates via Server Actions
- 🗑️ Soft delete with trash/restore
- 📊 Activity logging
- 🤝 Share todos with permissions (view/edit)
- 💾 PostgreSQL database with Prisma ORM
- 🎨 Professional UI with shadcn/ui

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5 (Auth.js)
- **State Management:** React Query + Server Actions
- **Validation:** Zod
- **Form Management:** React Hook Form

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+
- PostgreSQL database
- npm or yarn or pnpm

## Installation & Setup

### 1. Clone the repository (or use existing files)

```bash
cd C:\projects\Todo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Set up the database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Login with demo account

```
Email: john@example.com
Password: password123
```

## Project Structure

```
todo-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── (dashboard)/      # Dashboard pages (todos, activity, etc.)
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── layout/          # Layout components (sidebar, header)
│   │   ├── todos/           # Todo-related components
│   │   ├── ui/              # shadcn/ui components
│   │   └── providers/       # Context providers
│   ├── lib/
│   │   ├── actions/         # Server actions
│   │   ├── validations/     # Zod schemas
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── db.ts            # Prisma client
│   │   ├── utils.ts         # Utility functions
│   │   └── constants.ts     # App constants
│   ├── types/               # TypeScript types
│   └── middleware.ts        # Next.js middleware
├── public/                  # Static assets
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server

# Building
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma Client
npm run db:push         # Push schema to database
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio (database GUI)

# Code Quality
npm run lint            # Run ESLint
```

## Database Schema

### User
- Authentication and user management
- Supports both email/password and OAuth

### Todo
- Core todo item with title, description, status, priority
- Support for due dates, categories, tags
- Soft delete functionality
- Order management for custom sorting

### Subtask
- Nested tasks within a todo
- Track completion status independently

### Category & Tag
- Organize todos with categories and tags
- Custom colors and icons

### SharedTodo
- Share todos with other users
- View or edit permissions

### Activity
- Log all todo-related actions
- Track created, updated, completed, deleted, shared events

## Features Documentation

### Authentication
- Email/password registration and login
- Google OAuth integration
- Protected routes with middleware
- Session management with NextAuth.js

### Todo Management
- **Create:** Add new todos with title, description, priority, due date
- **Update:** Edit any aspect of a todo
- **Delete:** Soft delete (moves to trash)
- **Complete:** Toggle completion status
- **Filter:** By status, priority, category, tag, date range
- **Search:** Full-text search across title and description

### Categories & Tags
- Create custom categories with colors and icons
- Add multiple tags to todos
- Filter and organize by categories and tags

### Subtasks
- Add unlimited subtasks to any todo
- Track individual subtask completion
- View progress (e.g., 3/5 subtasks completed)

### Sharing
- Share todos with other users via email
- Set permissions (View or Edit)
- Track who todos are shared with
- Activity logging for sharing events

### Activity Log
- Automatic logging of all actions
- View recent activity across all todos
- Filter by action type

### Trash & Recovery
- Soft delete sends todos to trash
- Restore deleted todos
- Permanently delete individual todos
- Empty entire trash at once

### Themes
- Light and dark mode
- System preference detection
- Smooth theme transitions
- Persistent user preference

## API Architecture

This application uses **Next.js Server Actions** for all data mutations and queries, providing:
- Type-safe API calls
- Automatic revalidation
- Built-in error handling
- Progressive enhancement

### Key Server Actions

**Todo Actions** (`/lib/actions/todo.actions.ts`):
- `createTodo()` - Create new todo
- `updateTodo()` - Update existing todo
- `deleteTodo()` - Soft or permanent delete
- `restoreTodo()` - Restore from trash
- `getTodos()` - Get todos with filters
- `reorderTodos()` - Update todo order

**Auth Actions** (`/lib/actions/auth.actions.ts`):
- `register()` - User registration
- `login()` - User login

**Share Actions** (`/lib/actions/share.actions.ts`):
- `shareTodo()` - Share todo with user
- `updateSharePermission()` - Update permissions
- `removeShare()` - Revoke sharing

**Activity Actions** (`/lib/actions/activity.actions.ts`):
- `getActivities()` - Get activity log

## Security Features

- 🔒 Server-side authentication
- 🛡️ Protected routes with middleware
- ✅ Input validation with Zod
- 🔐 Password hashing with bcrypt
- 🚫 SQL injection prevention with Prisma
- 🎫 CSRF protection with NextAuth
- 🔑 Secure session management

## Performance Optimizations

- ⚡ Server Components for faster initial load
- 🎯 Selective hydration
- 🗄️ Database query optimization with Prisma
- 📦 Code splitting with Next.js App Router
- 🖼️ Optimized images with next/image
- 🎨 Tailwind CSS for minimal CSS bundle

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
```

### Deploy to Other Platforms

1. Build the application:
```bash
npm run build
```

2. Set environment variables on your hosting platform

3. Start the production server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | No |

## Optional Enhancements

Here are some features you could add to extend this application:

### 1. Real-time Collaboration
- WebSocket integration for live updates
- Presence indicators (who's viewing)
- Real-time cursors for shared todos

### 2. Notifications
- Browser push notifications
- Email notifications for due dates
- Reminders system

### 3. Advanced Filtering
- Saved filters/views
- Custom filter combinations
- Smart filters (overdue, due today, etc.)

### 4. File Attachments
- Upload files to todos
- Image previews
- File storage with S3 or similar

### 5. Calendar View
- Month/week/day views
- Drag & drop between dates
- iCal export

### 6. Recurring Todos
- Daily, weekly, monthly patterns
- Custom recurrence rules
- Skip/complete specific instances

### 7. Team Features
- Team workspaces
- Role-based access control
- Team activity feeds

### 8. Analytics
- Productivity metrics
- Completion rates
- Time tracking

### 9. Mobile App
- React Native app
- PWA with offline support
- Native notifications

### 10. Integrations
- Google Calendar sync
- Slack notifications
- Email import (create todos via email)

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Ensure database exists: `createdb todo_db`
4. Run `npm run db:push`

### Build Errors

If you encounter build errors:
1. Delete `.next` folder and `node_modules`
2. Run `npm install`
3. Run `npm run db:generate`
4. Run `npm run build`

### Authentication Issues

If login/registration doesn't work:
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your domain
3. Clear browser cookies and try again

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review closed issues for solutions

## Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- Vercel for hosting solutions
- Prisma for the excellent ORM

---

**Built with ❤️ using Next.js, React, and TypeScript**
