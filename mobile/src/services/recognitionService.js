import { apiRequest } from "./apiClient";

export async function recognizeKit({ imageDataUri, context = "other", expectedItems = null }) {
  return apiRequest("/api/v1/resqkit/recognize_kit", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ image: imageDataUri, context, expected_items: expectedItems }),
  });
}
