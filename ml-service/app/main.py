from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import random

app = FastAPI()

@app.post("/predict")
async def predict(req_data: BaseModel):
    # Replace with real logic in the future
    value = random.randint(1, 2)
    if value == 1: 
        return "Looks good!" 
    else:
        return "Bad. Try again."

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)