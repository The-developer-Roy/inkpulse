import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { RateLimiter } from '@/lib/rateLimiter';

const rateLimiter = new RateLimiter(5, 30); // Allow 5 requsts every 30 seconds

export async function POST(req: Request) {
    try {
        // Extracr the client IP address
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

        // Apply rate limiting
        const rateLimitResult = await rateLimiter.applyLimit(ip);

        // If rate limit exceeded, return an error response
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { message: rateLimitResult.error },
                { status: 429 }
            );
        }
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ message: 'Invalid or missing file' }, { status: 400 });
        }

        // Convert the file to base64
        const buffer = await file.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');
        const dataUri = `data:${file.type};base64,${base64String}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
            folder: 'blog_uploads', // Optional: specify a folder
        });

        return NextResponse.json({
            message: 'File uploaded successfully',
            data: uploadResponse,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Failed to upload file', error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: 'An unknown error occured', error: String(error) },
            { status: 500 }
        );
    }
}
