import sys
import json
import joblib
import numpy as np
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def load_artifacts():
    scaler = joblib.load(os.path.join(SCRIPT_DIR, "scaler.joblib"))
    label_encoders = joblib.load(os.path.join(SCRIPT_DIR, "label_encoders.joblib"))
    knn = joblib.load(os.path.join(SCRIPT_DIR, "knn_model.joblib"))
    rf = joblib.load(os.path.join(SCRIPT_DIR, "rf_model.joblib"))
    return scaler, label_encoders, knn, rf


def predict(input_data):
    scaler, label_encoders, knn, rf = load_artifacts()

    # Encode categoricals
    encoded = input_data.copy()
    categorical_map = {
        "gender": label_encoders["gender"],
        "married": label_encoders["married"],
        "education": label_encoders["education"],
        "self_employed": label_encoders["self_employed"],
        "property_area": label_encoders["property_area"],
    }

    for field, le in categorical_map.items():
        val = encoded.get(field, "")
        if val in le.classes_:
            encoded[field] = int(le.transform([val])[0])
        else:
            encoded[field] = 0

    features = np.array([[
        encoded["gender"],
        encoded["married"],
        int(encoded["dependents"]),
        encoded["education"],
        encoded["self_employed"],
        float(encoded["applicant_income"]),
        float(encoded["coapplicant_income"]),
        float(encoded["loan_amount"]),
        float(encoded["loan_amount_term"]),
        float(encoded["credit_history"]),
        encoded["property_area"],
    ]])

    features_scaled = scaler.transform(features)

    knn_pred = int(knn.predict(features_scaled)[0])
    knn_proba = knn.predict_proba(features_scaled)[0].tolist()

    rf_pred = int(rf.predict(features_scaled)[0])
    rf_proba = rf.predict_proba(features_scaled)[0].tolist()

    return {
        "knn": {
            "prediction": "Approved" if knn_pred == 1 else "Rejected",
            "confidence": round(max(knn_proba) * 100, 2),
            "probabilities": {"rejected": round(knn_proba[0] * 100, 2), "approved": round(knn_proba[1] * 100, 2)},
        },
        "rf": {
            "prediction": "Approved" if rf_pred == 1 else "Rejected",
            "confidence": round(max(rf_proba) * 100, 2),
            "probabilities": {"rejected": round(rf_proba[0] * 100, 2), "approved": round(rf_proba[1] * 100, 2)},
        },
    }


if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    result = predict(input_data)
    print(json.dumps(result))
