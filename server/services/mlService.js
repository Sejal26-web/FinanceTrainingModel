const { execFile } = require("child_process");
const path = require("path");
const AppError = require("../utils/AppError");

const SCRIPT_PATH = path.join(__dirname, "..", "..", "ml", "predict.py");
const PYTHON_TIMEOUT = 30_000;

function runPythonPrediction(input) {
  return new Promise((resolve, reject) => {
    const inputJson = JSON.stringify(input);

    execFile(
      "python",
      [SCRIPT_PATH, inputJson],
      { timeout: PYTHON_TIMEOUT },
      (error, stdout, stderr) => {
        if (error) {
          console.error("ML process error:", stderr || error.message);
          return reject(
            AppError.internal("ML prediction failed. Ensure models are trained (npm run ml:train).")
          );
        }

        try {
          const lines = stdout.trim().split("\n");
          const jsonLine = lines[lines.length - 1];
          const parsed = JSON.parse(jsonLine);
          resolve(parsed);
        } catch {
          reject(AppError.internal("Failed to parse ML model output"));
        }
      }
    );
  });
}

module.exports = { runPythonPrediction };
