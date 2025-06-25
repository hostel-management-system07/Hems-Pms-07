
// Google AI API configuration
export const GOOGLE_AI_API_KEY = "AIzaSyD5-UT3Y8fANKeNx29fWuppz89b6idTsBY";

// Google AI Vision API endpoint
export const VISION_API_ENDPOINT = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_AI_API_KEY}`;

// Analyze image with Google Vision AI
export async function analyzeImage(imageBase64: string) {
  try {
    const response = await fetch(VISION_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: imageBase64
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'TEXT_DETECTION', maxResults: 5 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 5 }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    return data.responses[0];
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}
