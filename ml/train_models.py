import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib
import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def generate_synthetic_data(n=1000):
    """Generate synthetic loan dataset."""
    np.random.seed(42)

    data = {
        "gender": np.random.choice(["Male", "Female"], n),
        "married": np.random.choice(["Yes", "No"], n),
        "dependents": np.random.choice([0, 1, 2, 3], n),
        "education": np.random.choice(["Graduate", "Not Graduate"], n),
        "self_employed": np.random.choice(["Yes", "No"], n, p=[0.15, 0.85]),
        "applicant_income": np.random.randint(1500, 80000, n),
        "coapplicant_income": np.random.randint(0, 40000, n),
        "loan_amount": np.random.randint(20, 700, n),
        "loan_amount_term": np.random.choice([36, 60, 84, 120, 180, 240, 300, 360, 480], n),
        "credit_history": np.random.choice([0.0, 1.0], n, p=[0.15, 0.85]),
        "property_area": np.random.choice(["Urban", "Semiurban", "Rural"], n),
    }

    df = pd.DataFrame(data)

    # Create realistic loan approval logic
    total_income = df["applicant_income"] + df["coapplicant_income"]
    income_ratio = (df["loan_amount"] * 1000) / (total_income + 1)

    approval_score = (
        (df["credit_history"] * 3)
        + (total_income > 5000).astype(int) * 1.5
        + (income_ratio < 5).astype(int) * 1.5
        + (df["education"] == "Graduate").astype(int) * 0.5
        + np.random.normal(0, 0.5, n)
    )

    df["loan_status"] = (approval_score > 3.0).astype(int)
    return df


def preprocess(df):
    """Encode categorical features and scale."""
    df_processed = df.copy()
    label_encoders = {}

    categorical_cols = ["gender", "married", "education", "self_employed", "property_area"]
    for col in categorical_cols:
        le = LabelEncoder()
        df_processed[col] = le.fit_transform(df_processed[col])
        label_encoders[col] = le

    feature_cols = [
        "gender", "married", "dependents", "education", "self_employed",
        "applicant_income", "coapplicant_income", "loan_amount",
        "loan_amount_term", "credit_history", "property_area",
    ]

    X = df_processed[feature_cols].values
    y = df_processed["loan_status"].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler, label_encoders, feature_cols


def evaluate_model(model, X_test, y_test, name):
    """Compute evaluation metrics."""
    y_pred = model.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)
    return {
        "model": name,
        "accuracy": round(accuracy_score(y_test, y_pred) * 100, 2),
        "precision": round(precision_score(y_test, y_pred, zero_division=0) * 100, 2),
        "recall": round(recall_score(y_test, y_pred, zero_division=0) * 100, 2),
        "f1_score": round(f1_score(y_test, y_pred, zero_division=0) * 100, 2),
        "confusion_matrix": cm.tolist(),
    }


def train():
    print("Generating dataset...")
    df = generate_synthetic_data(1000)

    print("Preprocessing...")
    X, y, scaler, label_encoders, feature_cols = preprocess(df)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # KNN
    print("Training KNN...")
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train, y_train)
    knn_cv = cross_val_score(knn, X, y, cv=5)
    knn_metrics = evaluate_model(knn, X_test, y_test, "KNN")
    knn_metrics["cv_scores"] = [round(s * 100, 2) for s in knn_cv.tolist()]
    knn_metrics["cv_mean"] = round(knn_cv.mean() * 100, 2)

    # Random Forest
    print("Training Random Forest...")
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    rf_cv = cross_val_score(rf, X, y, cv=5)
    rf_metrics = evaluate_model(rf, X_test, y_test, "Random Forest")
    rf_metrics["cv_scores"] = [round(s * 100, 2) for s in rf_cv.tolist()]
    rf_metrics["cv_mean"] = round(rf_cv.mean() * 100, 2)

    # Feature importance from RF
    rf_metrics["feature_importance"] = {
        feature_cols[i]: round(float(imp), 4)
        for i, imp in enumerate(rf.feature_importances_)
    }

    # Save models and artifacts
    joblib.dump(knn, os.path.join(SCRIPT_DIR, "knn_model.joblib"))
    joblib.dump(rf, os.path.join(SCRIPT_DIR, "rf_model.joblib"))
    joblib.dump(scaler, os.path.join(SCRIPT_DIR, "scaler.joblib"))
    joblib.dump(label_encoders, os.path.join(SCRIPT_DIR, "label_encoders.joblib"))
    joblib.dump(feature_cols, os.path.join(SCRIPT_DIR, "feature_cols.joblib"))

    results = {"knn": knn_metrics, "rf": rf_metrics}
    with open(os.path.join(SCRIPT_DIR, "metrics.json"), "w") as f:
        json.dump(results, f, indent=2)

    print("Training complete!")
    print(f"KNN Accuracy: {knn_metrics['accuracy']}%")
    print(f"RF  Accuracy: {rf_metrics['accuracy']}%")
    print(json.dumps(results, indent=2))
    return results


if __name__ == "__main__":
    train()
