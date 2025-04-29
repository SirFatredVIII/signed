This service contains our computer vision model and all supporting functionality.

## Credit

Our model is trained on the Sign Language MNIST dataset: https://www.kaggle.com/datasets/datamunge/sign-language-mnist?resource=download

The model is a modified version of this CNN on Kaggle: https://www.kaggle.com/code/madz2000/cnn-using-keras-100-accuracy/notebook

## Getting Started

First, navigate to the correct folder and create a virtual environment:

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

To make the ML service executable and run it:

```bash
chmod +x run.sh
./run.sh
```
