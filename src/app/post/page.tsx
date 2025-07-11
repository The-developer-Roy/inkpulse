// src/app/post/page.tsx
import React from "react";
import connectMongo from '@/lib/mongoose';
import Post from '@/app/models/Post';
import AllPostsClient from "./AllPostClient";

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

  return <AllPostsClient posts={posts}/>
}
