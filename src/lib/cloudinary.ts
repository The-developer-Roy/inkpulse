import { v2 as cloudinary } from 'cloudinary';
import logger from './logger';

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

logger.info("Connected to Cloudinary");

export default cloudinary;
