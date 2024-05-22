import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import bcrypt from 'bcryptjs';
import { findUserByEmail, saveUser } from '@/lib/dbModelFunctions/User';

export async function POST(request: Request) {
	try {
		// Ensure MongoDB connection
		await connectDB();

		// Retrieve username, email, and password from request body
		const { username, email, password } = await request.json();

		// Check if a user with the provided email already exists
		const existingUser = await findUserByEmail(email);

		if (existingUser) {
			return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
		}

		// Hash the password before storing it in the database
		const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

		// Create a new user document
		const newUser = await saveUser(username,email,hashedPassword);

		// Return a success message
		return NextResponse.json({ userId: newUser._id, message: 'User created successfully' }, { status: 201 });
	} catch (error) {
		console.error('Sign-up failed:', error);
		return NextResponse.json({ error: 'Sign-up failed' }, { status: 500 });
	}
}