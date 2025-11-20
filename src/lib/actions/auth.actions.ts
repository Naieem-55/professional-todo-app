'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { loginSchema, registerSchema } from '@/lib/validations/auth.schema'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function register(values: z.infer<typeof registerSchema>) {
  try {
    const validatedFields = registerSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { email, password, name } = validatedFields.data

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'Email already in use' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: 'Account created successfully!' }
  } catch (error) {
    return { error: 'Something went wrong' }
  }
}

export async function login(values: z.infer<typeof loginSchema>) {
  try {
    const validatedFields = loginSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const { email, password } = validatedFields.data

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return { success: 'Logged in successfully!' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' }
        default:
          return { error: 'Something went wrong' }
      }
    }

    throw error
  }
}
