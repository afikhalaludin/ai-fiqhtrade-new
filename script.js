const API_KEY = "ISI_API_KEY_KAMU";

// ===== SIMPLE MOVING AVERAGE =====
function calculateSMA(data, period) {
    let sum = 0;
    for (let i = data.length - period; i < data.length; i++) {
        sum += data[i];
    }
    return sum / period;
}

// ===== TREND H4 =====
function getTrendH4(h4Data) {
    const sma50 = calculateSMA(h4Data, 50);
    const lastPrice = h4Data[h4Data.length - 1];

    if (lastPrice > sma50) return "UPTREND";
    if (lastPrice < sma50) return "DOWNTREND";
    return "SIDEWAYS";
}

// ===== ENTRY M5 =====
function getSignalM5(m5Data) {
    const sma20 = calculateSMA(m5Data, 20);
    const lastPrice = m5Data[m5Data.length - 1];

    if (lastPrice > sma20) return "BUY";
    if (lastPrice < sma20) return "SELL";
    return "WAIT";
}

// ===== AI CONFIRMATION (RINGAN) =====
async function confirmWithAI(trend, signal) {

    const prompt = `
    Trend H4: ${trend}
    Entry M5: ${signal}
    Jawab hanya: BUY / SELL / WAIT
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 5
        })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// ===== MAIN FUNCTION =====
async function runAnalysis(h4Data, m5Data) {

    const trend = getTrendH4(h4Data);
    const signal = getSignalM5(m5Data);

    const finalDecision = await confirmWithAI(trend, signal);

    document.getElementById("result").innerText =
        `Trend: ${trend} | Entry: ${signal} | Final: ${finalDecision}`;
}

// ===== JALANKAN SETIAP 1 MENIT =====
setInterval(() => {
    runAnalysis(h4Prices, m5Prices);
}, 60000);
