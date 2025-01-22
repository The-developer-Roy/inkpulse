import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
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
