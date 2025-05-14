This service contains our computer vision model and all supporting functionality.

## Credit

Our sklearn model is a modified version of this sign language detection model: https://github.com/computervisioneng/sign-language-detector-python/tree/master

All training data is created by the owners of this repository.

## Getting Started

First, navigate to the correct folder and create a virtual environment:

```bash
cd ml-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r app/requirements.txt
```

To make the ML service executable and run it:

```bash
chmod +x run.sh
./run.sh
```
