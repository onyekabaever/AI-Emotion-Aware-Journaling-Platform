# Emotion-Aware Journaling Platform

This repository contains the implementation for the Master’s dissertation:

**“Design and Evaluation of an AI‑Driven Emotion‑Aware Journaling Platform for Digital Well‑Being.”**

The system is a full-stack web application that supports:
- authenticated journaling (text and voice)
- emotion recognition from text and speech using ONNX Runtime (CPU)
- persistence of entries and model outputs for later review

## Project Structure

- `backend/`: Django REST API (authentication, journaling CRUD, media upload, ONNX inference)
- `frontend/`: React + TypeScript (Vite) client application
- `Chapter4_System_Design_and_Implementation.md`, `Chapter5_Evaluation_and_Testing.md`, `Chapter6_Conclusion_and_Future_Work.md`: dissertation chapter drafts
- `Appendix_A_Run_Instructions.md`: complete setup/execution steps (Windows-first)

## Project Status

### Completed:
- ✔️ Fully developed **advanced frontend** (React + TypeScript)
- ✔️ Developed **Text Emotion Recognition Model** (RoBERTa-based)
- ✔️ Developed **Speech Emotion Recognition Model** (Wav2Vec2-based)
- ✔️ Exported ONNX models for backend deployment
- ✔️ Integration of ONNX models into Django backend
- ✔️ REST APIs for `/analyze-text`, `/analyze-speech`, and combined `/analyze-entry`
- ✔️ Full journaling dashboard + emotion analytics
- ✔️ Secure user authentication

## Technology Stack

**Frontend**
- React 18, TypeScript, Vite
- Tailwind CSS
- Zustand state management

**Backend**
- Django + Django REST Framework
- JWT authentication (SimpleJWT)
- drf-spectacular (OpenAPI + Swagger UI)
- SQLite (development persistence)

**Machine Learning (Inference)**
- ONNX Runtime (CPUExecutionProvider)
- Text emotion model: RoBERTa exported to ONNX
- Speech emotion model: Wav2Vec2 exported to ONNX

## Prerequisites

- **Python**: 3.10+ recommended
- **Node.js**: 18+ recommended (npm)
- **FFmpeg (recommended on Windows for audio)**: supports decoding browser-recorded `webm/opus` files

## Quick Start (Development)

For the full, dissertation-ready run procedure, see **Appendix A**: `Appendix_A_Run_Instructions.md`.

### 1) Backend (create Python env first)

From PowerShell:

1. `cd backend`
2. Create venv: `python -m venv .venv`
3. Activate venv: `\.\.venv\Scripts\Activate.ps1`
4. Install dependencies: `pip install -r requirements.txt`
5. Migrate DB: `python manage.py migrate`
6. Run server: `python manage.py runserver`

Backend base URL:
- `http://127.0.0.1:8000/`

API docs:
- Swagger UI: `http://127.0.0.1:8000/api/docs/`

### 2) Frontend

1. `cd frontend`
2. `npm install`
3. Create `frontend/.env`:
	 - `VITE_API_BASE=http://127.0.0.1:8000/api`
4. Run dev server: `npm run dev`

## Environment Variables

Backend supports optional `backend/.env` (defaults are safe for local development):

- `DJANGO_SECRET_KEY=...`
- `DJANGO_DEBUG=True`
- `DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost`
- `FFMPEG_PATH=C:\\path\\to\\ffmpeg.exe` (only if ffmpeg is not on PATH)

## Model Files (ONNX)

The backend expects model artefacts to exist in these locations:

- Text model: `backend/models/notebook/models/text_emotions_model/`
	- `text_emotion.onnx`
	- `labels.json`
	- `chosen_thresholds.json` (optional)

- Speech model: `backend/models/notebook/models/speech_emotions_model/`
	- `onnx/speech_emotion_model.onnx`
	- `labels.json`

## Notes (Windows Audio)

If speech analysis fails on Windows for uploaded/recorded audio, install FFmpeg and ensure:

- `ffmpeg` is on PATH, **or**
- `FFMPEG_PATH` points to `ffmpeg.exe`

## Author

- **Author:** Onyekaba Everistus
- **Programme:** MSc Artificial Intelligence
- **Institution:** Sheffield Hallam University
 
