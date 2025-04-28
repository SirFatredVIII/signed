"use server";

export const classifySign = async (imageBlob: Blob) => {
  const formData = new FormData();
  formData.append("sign", imageBlob, "sign.png");
  const response = await fetch("http://localhost:8000/classify", {
    method: "POST",
    body: formData,
  });

  try {
    if (!response.ok) {
      console.error("Server resposne:", response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};
