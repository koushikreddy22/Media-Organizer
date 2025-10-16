import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs/promises';
import * as tf from '@tensorflow/tfjs-node';
import * as faceapi from '@vladmandic/face-api';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { getQdrant } from './databases.js';
import sharp from 'sharp';
import scanEmitter from '../../eventBus.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'photo-face-organizer-hybrid'; // New DB name for hybrid app
const COLLECTION_FACES = 'faces';

const cropFace = async (det, tensor) => {
    const box = det.detection.box;

    // Crop face from image tensor
    const faceTensor = tf.image.cropAndResize(
        tensor.expandDims(0), // batch dimension
        [[
            box.top / tensor.shape[0],
            box.left / tensor.shape[1],
            box.bottom / tensor.shape[0],
            box.right / tensor.shape[1]
        ]],
        [0],
        [150, 150] // output size (height, width)
    );

    // Convert cropped tensor to image buffer
    const croppedTensor = faceTensor.squeeze();
    const croppedBuffer = await tf.node.encodeJpeg(croppedTensor, 'rgb'); // Ensure color space
    tf.dispose(croppedTensor);

    const base64 = Buffer.from(croppedBuffer).toString('base64');
    const photoData = `data:image/jpeg;base64,${base64}`;
    return photoData;
}

// MongoDB schema for photo metadata
const PhotoSchema = new mongoose.Schema({
    qdrantId: String,
    personId: String,
    name: String,
    timestamp: Date,
    path: String
});
const Photo = mongoose.model('Photo', PhotoSchema);

const NonFacePhotoSchema = new mongoose.Schema({
    path: String,
    timestamp: Date,
    reason: String // optional: why it was categorized as non-face
});
const NonFacePhoto = mongoose.model('NonFacePhoto', NonFacePhotoSchema);
mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Load Face-API models
await loadFaceApiModels();

async function loadFaceApiModels() {
    const modelPath = path.join(__dirname, 'models'); // Models will be in server/models
    console.log(`Loading models from: ${modelPath}`);
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        console.log('Face-API models loaded successfully');
    } catch (error) {
        console.error('Error loading Face-API models:', error);
        // Consider a more robust error handling for production
    }
}

async function GenerateEmbeddings(photos, path, event) {
    const qdrant = await getQdrant()
    const allFaces = {}
    const total = photos.length;

    for (const [i, imagePath] of Object.entries(photos)) {
        let fullPath = path + "/" + imagePath
        try {
            const normalizedBuffer = await sharp(fullPath)
                .ensureAlpha()        // Make sure image has alpha channel if missing
                .rotate()             // Fix EXIF orientation
                // .resize(800, 800, { fit: "inside" }) // Optional: limit max size
                .toBuffer();
            const tensor = tf.node.decodeImage(normalizedBuffer, 3);
            let detections = [];
            try {
                detections = await faceapi.detectAllFaces(tensor, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 }))
                    .withFaceLandmarks()
                    .withFaceDescriptors();
            } catch (err) {
                console.error("Face detection failed for", fullPath, err);
            }


            if (detections.length > 0) {
                for (const det of detections) {
                    const descriptorArray = Array.from(det.descriptor);
                    const id = uuidv4();
                    let searchResult = null;
                    searchResult = await qdrant.query('profiles', {
                        query: descriptorArray,
                        "with_payload": true,
                        "with_vectors": true,
                    });
                    searchResult = searchResult.points;

                    let personId, name;
                    if (searchResult.length > 0 && searchResult[0].score > 0.95) {
                        personId = searchResult[0].payload.personId;
                        name = searchResult[0].payload.name;
                        if (!allFaces[personId]) {
                            allFaces[personId] = {
                                id,
                                personId,
                                status: "known",
                                name: name,
                                imageBase64: await cropFace(det, tensor)
                            }
                        }
                    } else {
                        personId = uuidv4();
                        name = 'unknown';
                        allFaces[personId] = {
                            id,
                            personId,
                            status: "unknown",
                            imageBase64: await cropFace(det, tensor)
                        }
                        await qdrant.upsert('profiles', {
                            "points": [
                                {
                                    "id": id,
                                    "payload": {
                                        "personId": personId,
                                        "name": name
                                    },
                                    "vector": descriptorArray
                                }
                            ]
                        });
                    }



                    const photoDoc = new Photo({
                        qdrantId: id,
                        personId,
                        name,
                        timestamp: new Date(),
                        path: fullPath
                    });
                    await photoDoc.save();
                }
            } else {
                const nonFaceDoc = new NonFacePhoto({
                    path: fullPath,
                    timestamp: new Date(),
                    reason: 'No face detected'
                });
                await nonFaceDoc.save();
            }

            tf.dispose(tensor);
        } catch (error) {
            console.error(`Failed to process ${fullPath}:`, error);
        } finally {
            const progress = Math.round(((i + 1) / total) * 100);
            scanEmitter.emit('scan-progress', progress);
        }
    }

    return Object.values(allFaces);
}
export { GenerateEmbeddings }
