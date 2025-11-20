# Project Folder Structure

```
todo-app/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── todos/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── trash/
│   │   │   │       └── page.tsx
│   │   │   ├── shared/
│   │   │   │   └── page.tsx
│   │   │   ├── activity/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── webhooks/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── user-menu.tsx
│   │   ├── todos/
│   │   │   ├── todo-list.tsx
│   │   │   ├── todo-item.tsx
│   │   │   ├── todo-form.tsx
│   │   │   ├── todo-filters.tsx
│   │   │   ├── todo-search.tsx
│   │   │   ├── subtask-list.tsx
│   │   │   ├── tag-selector.tsx
│   │   │   ├── priority-badge.tsx
│   │   │   └── share-dialog.tsx
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   ├── ui/ (shadcn components)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── use-toast.ts
│   │   │   └── ...
│   │   └── providers/
│   │       ├── theme-provider.tsx
│   │       ├── query-provider.tsx
│   │       └── auth-provider.tsx
│   ├── lib/
│   │   ├── actions/
│   │   │   ├── todo.actions.ts
│   │   │   ├── auth.actions.ts
│   │   │   ├── activity.actions.ts
│   │   │   └── share.actions.ts
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── validations/
│   │   │   ├── todo.schema.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── share.schema.ts
│   │   ├── hooks/
│   │   │   ├── use-todos.ts
│   │   │   ├── use-keyboard-shortcuts.ts
│   │   │   └── use-offline.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── next-auth.d.ts
│   └── middleware.ts
├── public/
│   └── images/
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── components.json
└── README.md
```
