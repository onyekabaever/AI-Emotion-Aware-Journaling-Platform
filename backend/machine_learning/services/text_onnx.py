import json
import numpy as np
import onnxruntime as ort
from pathlib import Path
from transformers import AutoTokenizer

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models" / "notebook" / "models" / "text_emotions_model"

ONNX_PATH = MODEL_DIR / "text_emotion.onnx"
LABELS_PATH = MODEL_DIR / "labels.json"
THRESHOLDS_PATH = MODEL_DIR / "chosen_thresholds.json"  # optional

# IMPORTANT: set to your training max_length
MAX_LEN = 128

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR.as_posix(), use_fast=True)
session = ort.InferenceSession(ONNX_PATH.as_posix(), providers=["CPUExecutionProvider"])

labels = json.load(open(LABELS_PATH, "r", encoding="utf-8"))
labels_list = labels["labels"] if isinstance(labels, dict) and "labels" in labels else labels

thresholds = None
if THRESHOLDS_PATH.exists():
    t = json.load(open(THRESHOLDS_PATH, "r", encoding="utf-8"))
    thresholds = np.array(t.get("thresholds"), dtype=np.float32) if "thresholds" in t else None

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

def predict_text(text: str):
    enc = tokenizer(
        text,
        return_tensors="np",
        padding="max_length",
        truncation=True,
        max_length=MAX_LEN,
    )
    logits = session.run(
        ["logits"],
        {"input_ids": enc["input_ids"], "attention_mask": enc["attention_mask"]},
    )[0][0]

    probs = sigmoid(logits)

    if thresholds is not None and thresholds.shape[0] == probs.shape[0]:
        active = probs >= thresholds
    else:
        active = probs >= 0.5

    scores = {lab: float(p) for lab, p in zip(labels_list, probs)}
    active_labels = [lab for lab, a in zip(labels_list, active) if bool(a)]

    return {"scores": scores, "active_labels": active_labels}
