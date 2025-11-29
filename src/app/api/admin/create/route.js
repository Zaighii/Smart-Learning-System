import bcrypt from 'bcrypt'
import Admin from '@/model/Admin'
import connectToDatabase from '@/lib/db'

export async function POST(req) {
  try {
    await connectToDatabase()
    const { username, password } = await req.json()

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return new Response(JSON.stringify({ error: 'Admin already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = new Admin({
      username,
      password: hashedPassword,
      isAdmin: true,
    })
    await admin.save()

    return new Response(JSON.stringify({ message: 'Admin created successfully', admin }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Error creating admin' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
