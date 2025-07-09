'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ThumbnailUploadModalProps {
  postId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ThumbnailUploadModal: React.FC<ThumbnailUploadModalProps> = ({ postId, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        setUploading(true);
        const toastId = toast.loading('Uploading thumbnail...');

        const res = await fetch('/api/post/upload-thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId,
            image: base64Image,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success('Thumbnail uploaded!', { id: toastId });
          onSuccess?.();
          onClose();
        } else {
          toast.error(data.error || 'Upload failed', { id: toastId });
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong!');
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-[90vw] max-w-md shadow-xl space-y-4">
        <h2 className="text-lg font-semibold">Upload a Thumbnail</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 transition"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailUploadModal;
