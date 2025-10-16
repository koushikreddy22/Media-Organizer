// globalClient.js
import { QdrantClient } from "@qdrant/js-client-rest";
let qdrant = null;
const COLLECTION_FACES = "profiles";
async function getQdrant() {
    if (!qdrant) {
        qdrant = new QdrantClient({
            url: "http://localhost:6333",
            requestTimeout: 600000 // 60 seconds
        });
        const { exists } = await qdrant.collectionExists(COLLECTION_FACES);


        if (!exists) {
            await qdrant.createCollection(COLLECTION_FACES, {
                vectors: {
                    size: 128, // Face embeddings size
                    distance: 'Cosine', // or 'Euclidean'
                },
            });
            console.log(`Created Qdrant collection: ${COLLECTION_FACES}`);
        } else {
            console.log(`Qdrant collection ${COLLECTION_FACES} already exists`);
        }
    }
    return qdrant;
};
export { getQdrant };