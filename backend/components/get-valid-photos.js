import fs from 'fs';
import path from 'path';


/**
 * Returns an array of valid photo files in a given folder
 * @param {string} folderPath - Absolute path to folder
 * @returns {string[]} - Array of photo file names
 */
function getValidPhotos(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

        const photos = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return validExtensions.includes(ext);
        });

        return photos;
    } catch (err) {
        console.error('Error reading folder:', err.message);
        return [];
    }
}

function getValidPhotosRecursive(folderPath) {
    let photos = [];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

    function scanDir(dir) {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        items.forEach(item => {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                scanDir(fullPath);
            } else {
                const ext = path.extname(item.name).toLowerCase();
                if (validExtensions.includes(ext)) {
                    photos.push(fullPath);
                }
            }
        });
    }

    try {
        scanDir(folderPath);
    } catch (err) {
        console.error('Error scanning folder:', err.message);
    }

    return photos;
}

export { getValidPhotos, getValidPhotosRecursive }

