import axios from "axios";

// Function to request an image from your Node.js Express API
export async function generateImageFromPrompt(
  prompt: string
): Promise<string | null> {
  // Replace with the URL of your Node.js Express API endpoint
  const endpoint =
    "https://reload-api-l6w7zn6b3q-uc.a.run.app/api/generative/generateImagenImage";

  try {
    const response = await axios.post(endpoint, { prompt });
    const responseData = response.data;

    if (responseData && responseData.image) {
      console.log("response: ", response);
      console.log("responseData.image: ", responseData.image);

      // Assuming the API returns the base64 encoded image directly
      return responseData.image;
    } else {
      throw new Error("No image generated");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
