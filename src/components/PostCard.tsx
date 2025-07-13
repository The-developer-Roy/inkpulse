'use client';

import Link from 'next/link';
import Image from 'next/image';
import { convert } from 'html-to-text';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    likes: string[];
    postPic?: string;
    author: {
      name: string;
      profilePic?: string;
    };
  };
  setLoading: (value: boolean) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, setLoading }) => {
  const router = useRouter();

  const navigateWithSpinner = (path: string)=>{
    setLoading(true);
    router.push(path);
  }

  const cleanContent = convert(post.content, {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'skip' }, // skip images
    ],
  });

  const previewContent = cleanContent.length >= 200 ? `${cleanContent.slice(0, 200)}...` : cleanContent;


  return (
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {post.postPic && (
        <Image
          src={post.postPic}
          alt="Post thumbnail"
          width={800}
          height={400}
          className="rounded-xl w-full h-48 object-cover mb-4"
        />
      )}

      <div className="flex items-center gap-3 mb-3">
        {post.author.profilePic && (
          <Image
            src={post.author.profilePic}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <span className="font-medium text-gray-700">{post.author.name}</span>
      </div>

      <h2 className="text-2xl font-semibold text-black mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">{previewContent}</p>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
        <button onClick={()=>{navigateWithSpinner(`/post/${post._id}`)}} className="text-blue-600 hover:underline">
          Read more →
        </button>
      </div>
    </div>
  );
};

export default PostCard;
