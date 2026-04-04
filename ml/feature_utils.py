import numpy as np
import pandas as pd

CATEGORICAL_COLS = ["gender", "married", "education", "self_employed", "property_area"]


def engineer_features(df):
    """Create derived features for better model performance.

    Must be called AFTER categorical encoding (label encoding)
    so all base columns are numeric.
    """
    df = df.copy()
    df["total_income"] = df["applicant_income"] + df["coapplicant_income"]
    df["income_loan_ratio"] = df["total_income"] / (df["loan_amount"] * 1000 + 1)
    df["emi"] = (df["loan_amount"] * 1000) / (df["loan_amount_term"] + 1)
    df["emi_income_ratio"] = df["emi"] / (df["total_income"] + 1)
    df["log_applicant_income"] = np.log1p(df["applicant_income"])
    df["log_loan_amount"] = np.log1p(df["loan_amount"])
    df["has_coapplicant"] = (df["coapplicant_income"] > 0).astype(int)
    return df
