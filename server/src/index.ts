import express from "express";
import bodyParser from "body-parser"

const app = express();
const parser = bodyParser.json();

const PORT = 5000;

app.post("/run_model", parser, (req, res) => {
  
  fetch("http://0.0.0.0:5001/predict", {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((response) => response.json())
  .then((json) => res.send(json));
  
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
