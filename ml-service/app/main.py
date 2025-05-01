from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import uvicorn
import random
from PIL import Image
import io
import numpy as np

# model = tf.keras.models.load_model('app/keras_classifier/sign_language_model.keras')
model_dict = pickle.load(open('app/sklearn_classifier/model.p', 'rb'))
model = model_dict['model']
labels_dict = {0: 'A', 1: 'B', 2: 'C'}

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

class Landmarks(BaseModel):
    landmarks: list[float]

@app.post("/classify")
async def classify(landmarks: Landmarks):
    prediction = model.predict([np.asarray(landmarks.landmarks)])
    return {"letter": labels_dict[int(prediction[0])]}
    # print("Received file:", sign.filename)
    # image_bytes = await sign.read()
    # image = Image.open(io.BytesIO(image_bytes)).convert("L") # convert to grayscale
    # image = image.resize((28,28)) # resize to 28x28
    # image_array = np.array(image).astype("float32") / 255.0 # normalize
    # input_tensor = np.expand_dims(image_array, axis=(0, -1)) # add batch dimension (1, 28, 28, 1)
    # predictions = model.predict(input_tensor)
    # predicted_class = int(np.argmax(predictions[0]))
    # return JSONResponse(content={"predictedClass": predicted_class}, status_code=200)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)