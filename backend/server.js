const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Risk Calculation Model
function calculateRisk(data) {
    let risk = 0;

    if (data.bmi > 25) risk += 25;
    if (data.smoker === "Yes") risk += 30;
    if (data.family === "Yes") risk += 30;
    if (data.age > 45) risk += 20;

    return risk;
}

// Expense Prediction
function forecastExpense(risk) {
    return (2000 + risk * 20) * 12;
}

// Prediction API
app.post("/predict", (req, res) => {

    const { age, bmi, smoker, family, coverage } = req.body;

    const risk = calculateRisk({ age, bmi, smoker, family });
    const annualExpense = forecastExpense(risk);
    const preparedness = Math.max(0, 100 - risk);
    const gap = annualExpense - coverage;

    let riskLevel = "Low";
    if (risk > 50) riskLevel = "High";
    else if (risk > 25) riskLevel = "Moderate";

    let summary = "";
    if (riskLevel === "High")
        summary = "High probability of chronic disease. Preventive consultation advised.";
    else if (riskLevel === "Moderate")
        summary = "Moderate risk detected. Lifestyle changes recommended.";
    else
        summary = "Low immediate risk. Maintain healthy lifestyle.";

    res.json({
        risk,
        riskLevel,
        annualExpense,
        preparedness,
        gap,
        rewardPoints: preparedness,
        summary
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`CareChain+ Backend running at http://localhost:${PORT}`);
});
