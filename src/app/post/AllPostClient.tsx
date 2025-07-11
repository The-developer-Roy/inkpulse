"use client";

import React, { useState } from "react";
import PostCard from '@/components/PostCard';
import SearchBar from '@/components/SearchBar';

type PostType = {
    _id: string;
    title: string;
    content: string;
    likes: string[];
    postPic: string;
    tags: string[];
    author: {
        name: string;
        profilePic: string;
    };
};

export default function AllPostsClient({ posts }: { posts: PostType[] }) {

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-4xl font-bold mb-6">All Posts</h1>

      <div className="p-4 space-y-6">
        <SearchBar onSearch={setSearchQuery} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No posts found.
            </p>
          )}
        </div>
      </div>

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
