"use server";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const classifySign = async (dataAux: number[]) => {
  const res = await fetch("http://localhost:8000/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ landmarks: dataAux }),
  });

  try {
    if (!res.ok) {
      console.error("Server response:", res.status, res.statusText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const result = await res.json();
    return result.letter;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};
// export const classifySign = async (imageBlob: Blob) => {
//   const formData = new FormData();
//   formData.append("sign", imageBlob, "sign.png");
//   const response = await fetch("http://localhost:8000/classify", {
//     method: "POST",
//     body: formData,
//   });

//   try {
//     if (!response.ok) {
//       console.error("Server response:", response.status, response.statusText);
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const result = await response.json();
//     return ALPHABET[result.predictedClass];
//   } catch (error) {
//     console.error("Request failed:", error);
//     throw error;
//   }
// };
