import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongoose';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import { userCreateSchema, userUpdateSchema } from '@/app/schemas/user.schema';
import logger from '@/lib/logger';

// POST request for creating a new user
export async function POST(req: NextRequest) {
    try {
        logger.info('Received a POST request from the endpoint: "api/user"');

        await connectMongo(); // Reuse the connection logic

        // Parse the incoming request body
        const body = await req.json();

        // Validate the request body using Zod
        const { name, email, password } = userCreateSchema.parse(body); // Validate using Zod

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email is already in use' },
                { status: 400 }
            );
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password as string, 10);

        // Create a new user object and save it to the database
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save(); // Save the user to the database

        logger.info("Created a new user successfully");

        // Return the newly created user (excluding the password)
        const userResponse = {
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id,
        };

        return NextResponse.json({
            message: 'User created successfully',
            data: userResponse,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to create user', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}

// GET request for fetching user details
export async function GET(req: NextRequest) {
    try {
        await connectMongo(); // Connect to MongoDB

        // Parse query parameters for fetching a specific user
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email'); // Assume we're searching by email

        if (!email) {
            return NextResponse.json(
                { message: 'Email query parameter is required' },
                { status: 400 }
            );
        }

        // Fetch user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Return user details (excluding sensitive data like password)
        const { password, ...userData } = user.toObject();
        return NextResponse.json({ message: 'User fetched successfully', data: userData });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to fetch user', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred', error: String(error) },
            { status: 500 }
        );
    }
}

// PUT request for updating user details
export async function PUT(req: NextRequest) {
    try {
        logger.info('Received a PUT request from the endpoint: "api/user"');

        await connectMongo(); // Connect to MongoDB

        const body = await req.json(); // Parse request body

        //Validate the input data using Zod
        const { email, ...updates } = userUpdateSchema.parse(body);

        // Validate input
        if (!email) {
            return NextResponse.json(
                { message: 'Email is required to identify the user to update.' },
                { status: 400 }
            );
        }

        if (!Object.keys(updates).length) {
            return NextResponse.json(
                { message: 'At least one field to update must be provided.' },
                { status: 400 }
            );
        }

        // Update the user
        const updatedUser = await User.findOneAndUpdate(
            { email }, // Find user by email
            { $set: updates }, // Update fields
            { new: true, runValidators: true } // Return the updated user and validate schema
        );

        logger.info(`User with email: ${email} updated successfully`);

        if (!updatedUser) {
            return NextResponse.json(
                { message: 'User not found.' },
                { status: 404 }
            );
        }

        // Exclude sensitive fields (e.g., password) from the response
        const { password, ...userData } = updatedUser.toObject();

        return NextResponse.json({
            message: 'User updated successfully.',
            data: userData,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to update user.', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred.', error: String(error) },
            { status: 500 }
        );
    }
}

// DELETE request for deleting an user
export async function DELETE(req: NextRequest) {
    try {
        logger.info('Received a DELETE request from the endpoint: "api/user"');

        await connectMongo(); // Connect to MongoDB

        const { email } = await req.json(); // Parse request body

        // Validate input
        if (!email) {
            return NextResponse.json(
                { message: 'Email is required to delete a user.' },
                { status: 400 }
            );
        }

        // Delete the user
        const deletedUser = await User.findOneAndDelete({ email });

        logger.info(`User with email: ${email} deleted successfully`);

        if (!deletedUser) {
            return NextResponse.json(
                { message: 'User not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'User deleted successfully.',
            data: { email: deletedUser.email },
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to delete user.', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occurred.', error: String(error) },
            { status: 500 }
        );
    }
}