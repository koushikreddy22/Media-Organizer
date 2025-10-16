import { GenerateEmbeddings } from '../components/generate-embeddings.js';
import { getValidPhotos } from '../components/get-valid-photos.js';
import { verifyFace } from '../components/verify-face.js';


const digitizePhotos = async (path) => {
    console.log("Digitizing photos...");
    const validPhotos = getValidPhotos(path)
    const { allDescriptors, unknownFaces } = await GenerateEmbeddings(validPhotos, path)
    return { unknownFaces }
}

const verifyFaces = async (profile) => {
    // Import the verifyFace function from the verify-face module
    await verifyFace(profile);
    return { message: 'Face verification completed' };

}

export { digitizePhotos, verifyFaces }