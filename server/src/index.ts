import express, { json } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(json({ limit: "10mb" }));
const parser = bodyParser.json();

const PORT = 5002;

app.post("/predict", parser, (req, res) => {
  fetch("http://0.0.0.0:5001/predict", {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => {
    response.text().then((text) => {
      res.send(text);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
