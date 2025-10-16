import fs from 'fs';
import path from 'path';

export const uploadPhotos = async (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        if (imageFiles.length === 0) return { success: false, message: 'No image files found in the folder.' };

        // Simulate upload logic here, replace with actual upload to a service (e.g., AWS S3, Cloudinary)
        return { success: true, message: `Successfully "uploaded" ${imageFiles.length} images.`, files: imageFiles };
    } catch (error) {
        console.error("Error processing photos:", error);
        return { success: false, error: error.message };
    }
};