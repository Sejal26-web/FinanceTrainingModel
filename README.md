# Loan Approval Prediction System

A full-stack web application that predicts loan approval using **KNN** and **Random Forest** algorithms, with real-time comparison charts.

## Tech Stack

- **Frontend:** React 18, Chart.js
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **ML:** Python (scikit-learn) — KNN & Random Forest

## Project Structure

```
financial_loan_predictor/
├── client/              # React frontend
│   └── src/
│       ├── components/  # PredictionForm, ModelComparison, PredictionHistory
│       ├── App.js
│       └── api.js
├── server/              # Node.js backend
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── index.js
│   └── seed.js
├── ml/                  # Python ML models
│   ├── train_models.py
│   ├── predict.py
│   └── requirements.txt
└── .env
```

## Prerequisites

- Node.js 18+
- Python 3.8+
- MongoDB running locally (port 27017)

## Setup

### 1. Install dependencies

```bash
npm install
cd client && npm install && cd ..
pip install -r ml/requirements.txt
```

### 2. Train ML models

```bash
python ml/train_models.py
```

### 3. Seed sample data (optional)

```bash
npm run seed
```

### 4. Run the application

```bash
# Start both server and client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Features

- **Predict Tab:** Enter loan details and get instant KNN + RF predictions with confidence scores
- **Model Comparison Tab:** Side-by-side charts comparing accuracy, precision, recall, F1; radar chart; cross-validation scores; confusion matrices; RF feature importance
- **History Tab:** View all past predictions with agreement tracking

## API Endpoints

| Method | Endpoint               | Description                |
|--------|------------------------|----------------------------|
| POST   | /api/predictions       | Run prediction             |
| GET    | /api/predictions       | Get prediction history     |
| GET    | /api/predictions/stats | Aggregate stats            |
| GET    | /api/metrics           | Model performance metrics  |
| GET    | /api/health            | Health check               |
