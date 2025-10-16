import { getQdrant } from "./databases.js";

async function verifyFace({id,name}) {
    // Placeholder function for face verification logic
    // In a real implementation, this would involve calling a face recognition library or service
    const qdrant = await getQdrant()
    const updatedFace = await qdrant.setPayload("profiles", {
        payload: {
            name,
        },
        filter: {
            must: [
                {
                    key: "personId",
                    match: { value:id }
                }
            ]
        }
    });


    console.log('Verifying face with image data:', name);
    return { success: true, message: 'Face verified successfully' };
}

export { verifyFace };