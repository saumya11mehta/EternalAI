import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/dbModelFunctions/User';

export async function POST(request: Request) {
    try {
      // Ensure MongoDB connection
      await connectDB();

      // Retrieve email and password from request body
      const { email, password } = await request.json();

      // Check if user with the provided email exists
      const user = await findUserByEmail(email)

      if (!user) {
        return NextResponse.json({ error: 'Invalid Email' }, { status: 401 });
      }

      // Compare hashed password from the database with the provided password
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      // Passwords match, login successful
      return NextResponse.json({ userId: user._id,message: 'Login successful' }, { status: 200 });
    } catch (error) {
      console.error('Login failed:', error);
      return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}