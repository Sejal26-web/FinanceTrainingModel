import sys
import json
import joblib
import numpy as np
import pandas as pd
import os

from feature_utils import engineer_features

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def load_artifacts():
    scaler = joblib.load(os.path.join(SCRIPT_DIR, "scaler.joblib"))
    label_encoders = joblib.load(os.path.join(SCRIPT_DIR, "label_encoders.joblib"))
    feature_cols = joblib.load(os.path.join(SCRIPT_DIR, "feature_cols.joblib"))
    knn = joblib.load(os.path.join(SCRIPT_DIR, "knn_model.joblib"))
    rf = joblib.load(os.path.join(SCRIPT_DIR, "rf_model.joblib"))
    return scaler, label_encoders, feature_cols, knn, rf


def predict(input_data):
    scaler, label_encoders, feature_cols, knn, rf = load_artifacts()

    # Build a single-row DataFrame so feature engineering is identical to training
    row = {
        "gender": input_data.get("gender", "Male"),
        "married": input_data.get("married", "No"),
        "dependents": int(input_data.get("dependents", 0)),
        "education": input_data.get("education", "Graduate"),
        "self_employed": input_data.get("self_employed", "No"),
        "applicant_income": float(input_data.get("applicant_income", 0)),
        "coapplicant_income": float(input_data.get("coapplicant_income", 0)),
        "loan_amount": float(input_data.get("loan_amount", 0)),
        "loan_amount_term": float(input_data.get("loan_amount_term", 360)),
        "credit_history": float(input_data.get("credit_history", 1)),
        "property_area": input_data.get("property_area", "Urban"),
    }

    df = pd.DataFrame([row])

    # Encode categoricals with the same encoders used during training
    categorical_map = {
        "gender": label_encoders["gender"],
        "married": label_encoders["married"],
        "education": label_encoders["education"],
        "self_employed": label_encoders["self_employed"],
        "property_area": label_encoders["property_area"],
    }

    for field, le in categorical_map.items():
        val = df[field].iloc[0]
        if val in le.classes_:
            df[field] = int(le.transform([val])[0])
        else:
            df[field] = 0

    # Apply the same feature engineering used during training
    df = engineer_features(df)

    features = df[feature_cols].values
    features_scaled = scaler.transform(features)

    knn_pred = int(knn.predict(features_scaled)[0])
    knn_proba = knn.predict_proba(features_scaled)[0].tolist()

    rf_pred = int(rf.predict(features_scaled)[0])
    rf_proba = rf.predict_proba(features_scaled)[0].tolist()

    return {
        "knn": {
            "prediction": "Approved" if knn_pred == 1 else "Rejected",
            "confidence": round(max(knn_proba) * 100, 2),
            "probabilities": {
                "rejected": round(knn_proba[0] * 100, 2),
                "approved": round(knn_proba[1] * 100, 2),
            },
        },
        "rf": {
            "prediction": "Approved" if rf_pred == 1 else "Rejected",
            "confidence": round(max(rf_proba) * 100, 2),
            "probabilities": {
                "rejected": round(rf_proba[0] * 100, 2),
                "approved": round(rf_proba[1] * 100, 2),
            },
        },
    }


if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    result = predict(input_data)
    print(json.dumps(result))
