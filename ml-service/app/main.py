from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import uvicorn
import random
from PIL import Image
import io
import numpy as np
import pickle
from pydantic import BaseModel
from typing import List

# model = tf.keras.models.load_model('app/keras_classifier/sign_language_model.keras')
model_dict = pickle.load(open('app/sklearn_classifier/model.p', 'rb'))
model = model_dict['model']
labels_dict = dict(enumerate(list("ABCDEFGHIKLMNOPQRSTUVWXY")))

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

class LandmarkRequest(BaseModel):
    landmarks: List[float]

@app.post("/classify")
async def classify(req: LandmarkRequest):
    print("Received landmarks:", req.landmarks)
    prediction = model.predict([np.asarray(req.landmarks)])
    letter = labels_dict[int(prediction[0])]
    return {"letter": letter}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)