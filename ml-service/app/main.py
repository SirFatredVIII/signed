from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=False,  # Changed to False since we're not using credentials
    allow_methods=["POST"],   # Specify only needed methods
    allow_headers=["*"],
)

@app.post("/classify")
async def classify(sign: UploadFile = File(...)):
    # Replace with real logic in the future
    value = random.randint(1, 2)
    if value == 1: 
        return JSONResponse(content={"message": "Looks good!"}, status_code=200)
    else:
        return JSONResponse(content={"message": "Bad. Try again."}, status_code=200)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)