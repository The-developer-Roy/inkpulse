// src/app/post/page.tsx
import React, { Suspense } from "react";
import connectMongo from '@/lib/mongoose';
import Post from '@/app/models/Post';
import AllPostsClient from "./AllPostClient";
import Spinner from "@/components/Spinner";

function PostsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    </div>
  );
}

export default async function AllPostsPage() {
  await connectMongo();

  const rawPosts = await Post.find({ status: 'published' })
    .populate('author')
    .sort({ createdAt: -1 })
    .lean();

  const posts = rawPosts.map((post: any) => ({
    _id: post._id.toString(),
    title: post.title,
    content: post.content,
    likes: (post.likes ?? []).map((id: any) => id.toString()),
    postPic: post.postPic,
    tags: post.tags,
    author: {
      name: post.author?.name || 'Unknown',
      profilePic: post.author?.profilePic || '',
    },
  }));

  return (
    <Suspense fallback={<PostsLoading />}>
      <AllPostsClient posts={posts} />
    </Suspense>
  )
}
