import express from "express";

const app = express();

const PORT = 5000;

app.get("/api", (_, res) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
