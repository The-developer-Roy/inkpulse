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
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await connectMongo();

                // Validate credentials exist
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                // Find user
                const user = await User.findOne({ email: credentials.email });
                if (user) {
                    const isMatch = await bcrypt.compare(credentials.password, user.password);
                    // Check password
                    if (isMatch) {
                        // If everything is valid, return user object
                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                            profileCompleted: user.profileCompleted,
                        };
                    } else {
                        console.log("Invalid password");
                        return null;
                    }
                } else {
                    console.log("User not found");
                    return null;
                }


            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            await connectMongo();

            // Only handle Google signup here
            if (account?.provider === 'google') {
                const existingUser = await User.findOne({ email: profile?.email });

                if (existingUser) {
                    logger.info(`Existing user signed in with Google: ${profile?.email}`);
                    return true;
                }

                const newUser = new User({
                    name: profile?.name,
                    email: profile?.email,
                    password: null,
                });

                await newUser.save();
                logger.info(`Created new user through Google: ${profile?.email}`);
                return true;
            }

            // ✅ For credentials, always return true here.
            // The authorize() already validated the user.
            return true;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    name: token.name as string,
                    email: token.email as string,
                    image: token.picture as string | undefined,
                    profileCompleted: token.profileCompleted as boolean,
                };
            }
            return session;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.profileCompleted = user.profileCompleted;
            }
            return token;
        },
    },

    pages: {
        signIn: '/auth/signin',
    },
};

export default authOptions;
