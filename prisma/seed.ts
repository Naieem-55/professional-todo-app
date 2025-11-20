import { PrismaClient, Priority, TodoStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.activity.deleteMany()
  await prisma.sharedTodo.deleteMany()
  await prisma.todoTag.deleteMany()
  await prisma.subtask.deleteMany()
  await prisma.todo.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Users created')

  // Create categories
  const workCategory = await prisma.category.create({
    data: {
      name: 'Work',
      color: '#3b82f6',
      icon: '💼',
      userId: user1.id,
    },
  })

  const personalCategory = await prisma.category.create({
    data: {
      name: 'Personal',
      color: '#10b981',
      icon: '🏠',
      userId: user1.id,
    },
  })

  const shoppingCategory = await prisma.category.create({
    data: {
      name: 'Shopping',
      color: '#f59e0b',
      icon: '🛒',
      userId: user1.id,
    },
  })

  console.log('✅ Categories created')

  // Create tags
  const urgentTag = await prisma.tag.create({
    data: {
      name: 'Urgent',
      color: '#ef4444',
      userId: user1.id,
    },
  })

  const meetingTag = await prisma.tag.create({
    data: {
      name: 'Meeting',
      color: '#8b5cf6',
      userId: user1.id,
    },
  })

  const projectTag = await prisma.tag.create({
    data: {
      name: 'Project',
      color: '#06b6d4',
      userId: user1.id,
    },
  })

  console.log('✅ Tags created')

  // Create todos with subtasks
  const todo1 = await prisma.todo.create({
    data: {
      title: 'Complete Q4 Report',
      description: 'Prepare and submit the quarterly business report with all metrics and analysis.',
      status: TodoStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      order: 0,
      userId: user1.id,
      categoryId: workCategory.id,
      subtasks: {
        create: [
          { title: 'Gather sales data', isCompleted: true, order: 0 },
          { title: 'Analyze market trends', isCompleted: true, order: 1 },
          { title: 'Create visualizations', isCompleted: false, order: 2 },
          { title: 'Write executive summary', isCompleted: false, order: 3 },
        ],
      },
      tags: {
        create: [
          { tag: { connect: { id: urgentTag.id } } },
          { tag: { connect: { id: projectTag.id } } },
        ],
      },
    },
  })

  const todo2 = await prisma.todo.create({
    data: {
      title: 'Team Standup Meeting',
      description: 'Daily sync with the development team to discuss progress and blockers.',
      status: TodoStatus.PENDING,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      order: 1,
      userId: user1.id,
      categoryId: workCategory.id,
      tags: {
        create: [{ tag: { connect: { id: meetingTag.id } } }],
      },
    },
  })

  const todo3 = await prisma.todo.create({
    data: {
      title: 'Grocery Shopping',
      description: 'Buy weekly groceries and household items.',
      status: TodoStatus.PENDING,
      priority: Priority.LOW,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      order: 2,
      userId: user1.id,
      categoryId: shoppingCategory.id,
      subtasks: {
        create: [
          { title: 'Vegetables', isCompleted: false, order: 0 },
          { title: 'Fruits', isCompleted: false, order: 1 },
          { title: 'Dairy products', isCompleted: false, order: 2 },
          { title: 'Cleaning supplies', isCompleted: false, order: 3 },
        ],
      },
    },
  })

  const todo4 = await prisma.todo.create({
    data: {
      title: 'Plan Weekend Trip',
      description: 'Research and book accommodation for the weekend getaway.',
      status: TodoStatus.PENDING,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      order: 3,
      userId: user1.id,
      categoryId: personalCategory.id,
    },
  })

  const todo5 = await prisma.todo.create({
    data: {
      title: 'Read "Atomic Habits"',
      description: 'Finish reading the book and take notes on key concepts.',
      status: TodoStatus.IN_PROGRESS,
      priority: Priority.LOW,
      order: 4,
      userId: user1.id,
      categoryId: personalCategory.id,
    },
  })

  // Completed todo
  const todo6 = await prisma.todo.create({
    data: {
      title: 'Submit expense report',
      description: 'Upload receipts and submit monthly expense report.',
      status: TodoStatus.COMPLETED,
      priority: Priority.MEDIUM,
      order: 5,
      userId: user1.id,
      categoryId: workCategory.id,
      completedAt: new Date(),
    },
  })

  // Deleted todo (in trash)
  const todo7 = await prisma.todo.create({
    data: {
      title: 'Old task to delete',
      description: 'This task is no longer needed.',
      status: TodoStatus.PENDING,
      priority: Priority.LOW,
      order: 6,
      userId: user1.id,
      isDeleted: true,
      deletedAt: new Date(),
    },
  })

  console.log('✅ Todos created')

  // Share a todo with user2
  await prisma.sharedTodo.create({
    data: {
      todoId: todo1.id,
      userId: user2.id,
      permission: 'VIEW',
    },
  })

  console.log('✅ Shared todos created')

  // Create activity logs
  await prisma.activity.createMany({
    data: [
      {
        type: 'CREATED',
        description: `Created todo "${todo1.title}"`,
        userId: user1.id,
        todoId: todo1.id,
        metadata: { todoTitle: todo1.title },
      },
      {
        type: 'UPDATED',
        description: `Updated todo "${todo1.title}"`,
        userId: user1.id,
        todoId: todo1.id,
        metadata: { changes: ['Added subtasks'] },
      },
      {
        type: 'COMPLETED',
        description: `Completed todo "${todo6.title}"`,
        userId: user1.id,
        todoId: todo6.id,
        metadata: { todoTitle: todo6.title },
      },
      {
        type: 'DELETED',
        description: `Deleted todo "${todo7.title}"`,
        userId: user1.id,
        todoId: todo7.id,
        metadata: { todoTitle: todo7.title },
      },
      {
        type: 'SHARED',
        description: `Shared todo "${todo1.title}" with ${user2.name}`,
        userId: user1.id,
        todoId: todo1.id,
        metadata: { sharedWith: user2.email },
      },
    ],
  })

  console.log('✅ Activity logs created')

  console.log('\n🎉 Seeding completed successfully!')
  console.log('\n📧 Demo user credentials:')
  console.log('   Email: john@example.com')
  console.log('   Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
