// src/app/post/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import connectMongo from "@/lib/mongoose";
import User from "@/app/models/User";
import Post from "@/app/models/Post";
import { Metadata } from "next";

interface Params {
  params: { id: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  await connectMongo();
  const { id } = await params;
  const post = await Post.findById(id);
  if (!post) return {};
  return {
    title: post.title,
    description: post.content?.replace(/<[^>]*>?/gm, "").slice(0, 150),
  };
}

export default async function PostPage({ params }: Params) {
  await connectMongo();
  const { id } = await params;
  const post = await Post.findById(id).populate("author");

  if (!post || !post.author || post.status !== "published") return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 bg-white">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 mb-6">
        {post.author?.profilePic && (
          <Image
            src={post.author.profilePic}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <p className="text-gray-700">{post.author?.name}</p>
      </div>

      <article
        className="prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
