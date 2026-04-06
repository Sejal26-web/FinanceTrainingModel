import pandas as pd
import numpy as np
from sklearn.model_selection import (
    train_test_split,
    cross_val_score,
    StratifiedKFold,
    GridSearchCV,
)
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score,
)
import joblib
import os
import json

from feature_utils import engineer_features, CATEGORICAL_COLS

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


# ── Data generation ──────────────────────────────────────────────

def generate_synthetic_data(n=5000):
    """Generate a realistic synthetic loan dataset with multi-factor approval logic."""
    np.random.seed(42)


    # Lognormal income distributions (more realistic than uniform)
    applicant_income = np.random.lognormal(mean=8.5, sigma=0.8, size=n).astype(int)
    applicant_income = np.clip(applicant_income, 1500, 150000)

    # ~60% of applicants have a coapplicant
    has_co = np.random.random(n) > 0.4
    coapplicant_income = np.where(
        has_co,
        np.random.lognormal(mean=7.5, sigma=0.9, size=n).astype(int),
        0,
    )
    coapplicant_income = np.clip(coapplicant_income, 0, 80000)

    # Lognormal loan amounts for a realistic right-skewed distribution
    loan_amount = np.random.lognormal(mean=4.8, sigma=0.6, size=n).astype(int)
    loan_amount = np.clip(loan_amount, 20, 700)

    data = {
        "gender": np.random.choice(["Male", "Female"], n, p=[0.65, 0.35]),
        "married": np.random.choice(["Yes", "No"], n, p=[0.65, 0.35]),
        "dependents": np.random.choice([0, 1, 2, 3], n, p=[0.35, 0.30, 0.20, 0.15]),
        "education": np.random.choice(["Graduate", "Not Graduate"], n, p=[0.70, 0.30]),
        "self_employed": np.random.choice(["Yes", "No"], n, p=[0.15, 0.85]),
        "applicant_income": applicant_income,
        "coapplicant_income": coapplicant_income,
        "loan_amount": loan_amount,
        "loan_amount_term": np.random.choice(
            [36, 60, 84, 120, 180, 240, 300, 360, 480],
            n,
            p=[0.02, 0.05, 0.05, 0.10, 0.15, 0.10, 0.08, 0.40, 0.05],
        ),
        "credit_history": np.random.choice([0.0, 1.0], n, p=[0.15, 0.85]),
        "property_area": np.random.choice(
            ["Urban", "Semiurban", "Rural"], n, p=[0.35, 0.40, 0.25]
        ),
    }

    df = pd.DataFrame(data)

    # ── Multi-factor approval logic ──
    total_income = df["applicant_income"] + df["coapplicant_income"]
    loan_value = df["loan_amount"] * 1000
    income_ratio = loan_value / (total_income + 1)
    emi = loan_value / (df["loan_amount_term"] + 1)
    emi_ratio = emi / (total_income + 1)

    score = np.zeros(n)

    # Credit history — strongest signal
    score += df["credit_history"] * 4.0

    # Income tiers
    score += (total_income > 5000).astype(float) * 1.5
    score += (total_income > 15000).astype(float) * 1.0
    score += (total_income > 30000).astype(float) * 0.5

    # Loan affordability
    score += (income_ratio < 3).astype(float) * 2.0
    score += (income_ratio < 5).astype(float) * 1.0
    score -= (income_ratio > 8).astype(float) * 2.0

    # EMI burden
    score -= (emi_ratio > 0.5).astype(float) * 1.5
    score -= (emi_ratio > 0.7).astype(float) * 1.5

    # Education & employment risk
    score += (df["education"] == "Graduate").astype(float) * 0.8
    score -= (
        (df["self_employed"] == "Yes") & (df["credit_history"] == 0)
    ).astype(float) * 1.5

    # Coapplicant support
    score += (df["coapplicant_income"] > 0).astype(float) * 0.5

    # Location effect
    score += (df["property_area"] == "Semiurban").astype(float) * 0.3

    # Dependents penalty when income is low
    score -= (
        (df["dependents"] >= 3) & (total_income < 5000)
    ).astype(float) * 1.0

    # Realistic noise
    score += np.random.normal(0, 0.8, n)

    df["loan_status"] = (score > 3.0).astype(int)
    approval_pct = df["loan_status"].mean() * 100
    print(f"  Approval rate: {approval_pct:.1f}%")

    return df


# ── Preprocessing ────────────────────────────────────────────────

def preprocess(df):
    """Label-encode categoricals, engineer features, and scale."""
    df_processed = df.copy()
    label_encoders = {}

    for col in CATEGORICAL_COLS:
        le = LabelEncoder()
        df_processed[col] = le.fit_transform(df_processed[col])
        label_encoders[col] = le

    # Derive new features (after encoding so all cols are numeric)
    df_processed = engineer_features(df_processed)

    feature_cols = [
        "gender", "married", "dependents", "education", "self_employed",
        "applicant_income", "coapplicant_income", "loan_amount",
        "loan_amount_term", "credit_history", "property_area",
        # engineered
        "total_income", "income_loan_ratio", "emi", "emi_income_ratio",
        "log_applicant_income", "log_loan_amount", "has_coapplicant",
    ]

    X = df_processed[feature_cols].values
    y = df_processed["loan_status"].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler, label_encoders, feature_cols


# ── Evaluation ───────────────────────────────────────────────────

def evaluate_model(model, X_test, y_test, name):
    """Compute comprehensive evaluation metrics."""
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    cm = confusion_matrix(y_test, y_pred)
    return {
        "model": name,
        "accuracy": round(accuracy_score(y_test, y_pred) * 100, 2),
        "precision": round(precision_score(y_test, y_pred, zero_division=0) * 100, 2),
        "recall": round(recall_score(y_test, y_pred, zero_division=0) * 100, 2),
        "f1_score": round(f1_score(y_test, y_pred, zero_division=0) * 100, 2),
        "roc_auc": round(roc_auc_score(y_test, y_proba) * 100, 2),
        "confusion_matrix": cm.tolist(),
    }


# ── Training ─────────────────────────────────────────────────────

def train():
    print("Generating dataset (1 000 samples)…")
    df = generate_synthetic_data(1000)

    print("Preprocessing & feature engineering…")
    X, y, scaler, label_encoders, feature_cols = preprocess(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y,
    )

    # Simple models without grid search
    print("Training KNN…")
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train, y_train)

    print("Training Random Forest…")
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)

    # Simple evaluation
    knn_metrics = evaluate_model(knn, X_test, y_test, "KNN")
    rf_metrics = evaluate_model(rf, X_test, y_test, "Random Forest")
    
    # Feature importance from RF
    rf_metrics["feature_importance"] = {
        feature_cols[i]: round(float(imp), 4)
        for i, imp in enumerate(rf.feature_importances_)
    }

    # ── Save artefacts ──
    print("Saving models…")
    joblib.dump(knn, os.path.join(SCRIPT_DIR, "knn_model.joblib"))
    joblib.dump(rf, os.path.join(SCRIPT_DIR, "rf_model.joblib"))
    joblib.dump(scaler, os.path.join(SCRIPT_DIR, "scaler.joblib"))
    joblib.dump(label_encoders, os.path.join(SCRIPT_DIR, "label_encoders.joblib"))
    joblib.dump(feature_cols, os.path.join(SCRIPT_DIR, "feature_cols.joblib"))

    results = {"knn": knn_metrics, "rf": rf_metrics}
    with open(os.path.join(SCRIPT_DIR, "metrics.json"), "w") as f:
        json.dump(results, f, indent=2)

    print("\nTraining complete!")
    print(
        f"KNN — Accuracy: {knn_metrics['accuracy']}%  "
        f"F1: {knn_metrics['f1_score']}%  "
        f"AUC: {knn_metrics['roc_auc']}%"
    )
    print(
        f"RF  — Accuracy: {rf_metrics['accuracy']}%  "
        f"F1: {rf_metrics['f1_score']}%  "
        f"AUC: {rf_metrics['roc_auc']}%"
    )
    return results


if __name__ == "__main__":
    train()
