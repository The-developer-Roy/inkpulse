import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import connectMongo from '@/lib/mongoose';
import logger from '@/lib/logger';

const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // Credentials Provider
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await connectMongo();
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await User.findOne({ email: credentials.email });

                // Check if the user exists and password is correct
                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    logger.info(`User ${user.email} successfully logged in through credentials`);
                    return { id: user._id.toString(), email: user.email, name: user.name };
                }
                else{
                    logger.warn(`Login failed: Incorrecr password for ${credentials.email}`);
                    return null;
                }
            },
        }),

        // Google Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            await connectMongo(); // Ensure DB connection

            if (account?.provider === 'google') {
                const existingUser = await User.findOne({ email: profile?.email });

                if (existingUser) {
                    return true; // Allow sign-in
                }

                logger.info("Authorized an user through google");

                // Create new user if not found
                const newUser = new User({
                    name: profile?.name, // GitHub uses 'login' instead of 'name'
                    email: profile?.email,
                    password: null, // Set to null as OAuth does not use passwords
                });

                await newUser.save();
                logger.info("Created a new user through google");
                return true; // Allow sign-in after user creation
            }

            return false; // Deny sign-in for unsupported providers
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string, // Explicitly set the id
                    name: token.name as string,
                    email: token.email as string,
                    image: token.picture as string | undefined, // Optional image field
                };
            }
            return session;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },

    },
    pages: {
        signIn: '/auth/signin', // Customize the sign-in page path
    },

};



export default authOptions;
