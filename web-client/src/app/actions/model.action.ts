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
