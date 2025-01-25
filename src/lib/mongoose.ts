import mongoose from 'mongoose';
import logger from './logger';

const connectMongo = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || '');
            console.log('MongoDB connected successfully');
            logger.info("Connected to MongoDB");
        }
    } catch (error) {
        // Ensure error is properly typed
        if (error instanceof Error) {
            console.error('Error connecting to MongoDB:', error.message);
            logger.warn("MongoDB connection failed");
            throw new Error(`MongoDB connection failed: ${error.message}`);
        } else {
            console.error('Unknown error occurred while connecting to MongoDB');
            logger.error("Unknown error occurred while connecting to MongoDB");
            throw new Error('MongoDB connection failed due to an unknown error');
        }
    }
};

export default connectMongo;
