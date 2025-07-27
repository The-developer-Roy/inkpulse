'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative bg-white dark:bg-zinc-900 p-6 rounded-2xl w-[90vw] max-w-md shadow-2xl space-y-5"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Modal Title */}
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Upload a Thumbnail
          </h2>

          {/* File Input */}
          <label className="block w-full">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition text-center">
              <p className="text-gray-500 text-sm">
                {selectedFile ? selectedFile.name : 'Click or drag & drop to select an image'}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </label>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 transition text-sm font-medium"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThumbnailUploadModal;
