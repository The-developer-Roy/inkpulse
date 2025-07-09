// src/app/post/page.tsx
import React from 'react';
import connectMongo from '@/lib/mongoose';
import Post from '@/app/models/Post';
import PostCard from '@/components/PostCard';

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
    author: {
      name: post.author?.name || 'Unknown',
      profilePic: post.author?.profilePic || '',
    },
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-4xl font-bold mb-6">All Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
