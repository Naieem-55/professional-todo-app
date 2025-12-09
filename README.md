# Professional Todo Application

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748.svg)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-quality todo application built with Next.js 14, featuring authentication, real-time updates, sharing, and activity logging.

## Features

### Core Functionality
- Create, update, and delete todos
- Mark items complete with visual feedback
- Due dates and priority levels (High, Medium, Low)
- Tags and categories for organization
- Subtasks for complex items

### Advanced Features
- **User Authentication**: Email + Google OAuth via NextAuth.js v5
- **Multi-User Support**: Share todos with other users
- **Real-Time Updates**: Server Actions for instant feedback
- **Soft Deletes**: Recover accidentally deleted items
- **Activity Logging**: Track all changes
- **Dark & Light Mode**: Theme switching

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| UI | TailwindCSS + shadcn/ui |
| Validation | Zod |
| Forms | React Hook Form |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Naieem-55/professional-todo-app.git
cd professional-todo-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and auth secrets

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Project Structure

```
professional-todo-app/
├── app/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── todos/            # Todo-specific components
│   └── shared/           # Shared components
├── lib/
│   ├── auth.ts           # Auth configuration
│   ├── db.ts             # Prisma client
│   └── validations.ts    # Zod schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── actions/              # Server Actions
```

## API Reference

### Server Actions

The application uses Next.js Server Actions instead of traditional REST APIs.

#### Todo Actions

```typescript
// Create a todo
import { createTodo } from '@/actions/todos'

await createTodo({
  title: "Complete project",
  description: "Finish the todo app",
  priority: "HIGH",
  dueDate: new Date("2025-12-31"),
  tags: ["work", "urgent"]
})

// Update a todo
import { updateTodo } from '@/actions/todos'

await updateTodo(todoId, {
  title: "Updated title",
  completed: true
})

// Delete a todo (soft delete)
import { deleteTodo } from '@/actions/todos'

await deleteTodo(todoId)

// Get todos with filters
import { getTodos } from '@/actions/todos'

const todos = await getTodos({
  completed: false,
  priority: "HIGH",
  search: "project"
})
```

#### Sharing Actions

```typescript
// Share a todo
import { shareTodo } from '@/actions/sharing'

await shareTodo(todoId, {
  email: "user@example.com",
  permission: "EDIT" // or "VIEW"
})

// Remove share
import { removeShare } from '@/actions/sharing'

await removeShare(shareId)
```

## Database Schema

```prisma
model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  subtasks    Subtask[]
  tags        Tag[]
  shares      Share[]
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## Testing

### Running Tests

```bash
# Install test dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run E2E tests (requires Playwright)
npm run test:e2e
```

### Test Structure

```
tests/
├── unit/
│   ├── actions/          # Server action tests
│   ├── components/       # Component tests
│   └── lib/              # Utility tests
├── integration/
│   └── api/              # API integration tests
└── e2e/
    ├── auth.spec.ts      # Auth flow tests
    └── todos.spec.ts     # Todo CRUD tests
```

### Example Test

```typescript
// tests/unit/actions/todos.test.ts
import { describe, it, expect } from 'vitest'
import { createTodo, getTodos } from '@/actions/todos'

describe('Todo Actions', () => {
  it('should create a new todo', async () => {
    const todo = await createTodo({
      title: 'Test Todo',
      priority: 'HIGH'
    })

    expect(todo.title).toBe('Test Todo')
    expect(todo.priority).toBe('HIGH')
    expect(todo.completed).toBe(false)
  })

  it('should filter todos by priority', async () => {
    const todos = await getTodos({ priority: 'HIGH' })

    expect(todos.every(t => t.priority === 'HIGH')).toBe(true)
  })
})
```

## Accessibility

### Implemented Features
- Semantic HTML structure
- Keyboard navigation support
- Focus management
- Screen reader compatible
- Color contrast compliance

### Accessibility Checklist

- [x] All interactive elements are keyboard accessible
- [x] Form inputs have associated labels
- [x] Error messages are announced to screen readers
- [x] Color is not the only means of conveying information
- [x] Touch targets are at least 44x44 pixels
- [ ] Skip navigation link (planned)
- [ ] ARIA live regions for dynamic content (planned)

### Testing Accessibility

```bash
# Using axe-core
npm install -D @axe-core/react

# Add to your test setup
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
```

## Database Migrations

### Development

```bash
# Create migration
npx prisma migrate dev --name add_feature

# Apply migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset
```

### Production

```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

### Rollback Strategy

1. Create a backup before migration: `pg_dump -U user todo_db > backup.sql`
2. Apply migration: `npx prisma migrate deploy`
3. If issues occur: `psql -U user todo_db < backup.sql`

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Enable HTTPS
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Review security headers

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Write tests for new functionality
4. Ensure all tests pass (`npm run test`)
5. Run linting (`npm run lint`)
6. Commit changes (`git commit -m 'Add new feature'`)
7. Push to branch (`git push origin feature/new-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Conventional Commits format
- Write tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## Known Limitations

- Real-time collaboration requires page refresh (WebSocket planned)
- Attachments not yet supported
- Mobile app not available
- Bulk operations limited to 50 items

## Roadmap

- [ ] Real-time collaboration with WebSockets
- [ ] File attachments
- [ ] Calendar view
- [ ] Recurring tasks
- [ ] Team workspaces
- [ ] Mobile app (React Native)
- [ ] Slack/Discord integration

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Prisma](https://prisma.io/) for the excellent ORM
