import { GenerateEmbeddings } from '../components/generate-embeddings.js';
import { getValidPhotos } from '../components/get-valid-photos.js';
import { verifyFace } from '../components/verify-face.js';


const digitizePhotos = async (path, event) => {
    console.log("Digitizing photos...");
    const validPhotos = getValidPhotos(path)
    const allFaces = await GenerateEmbeddings(validPhotos, path, event)
    return allFaces
}

const verifyFaces = async (profile) => {
    // Import the verifyFace function from the verify-face module
    await verifyFace(profile);
    return { message: 'Face verification completed' };

}

export { digitizePhotos, verifyFaces }