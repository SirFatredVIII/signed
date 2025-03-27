from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.post("/predict")
async def predict():
    # Replace with real logic in the future
    return "Response from the model"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)