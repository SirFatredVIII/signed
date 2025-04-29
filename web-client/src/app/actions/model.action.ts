"use server";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const classifySign = async (imageBlob: Blob) => {
  const formData = new FormData();
  formData.append("sign", imageBlob, "sign.png");
  const response = await fetch("http://localhost:8000/classify", {
    method: "POST",
    body: formData,
  });

  try {
    if (!response.ok) {
      console.error("Server response:", response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return ALPHABET[result.predictedClass];
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};
