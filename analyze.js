export default async function handler(req, res){

const { image } = req.body;

const response = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{
role: "user",
content: [
{
type: "text",
text: `
Analisa chart ini fokus:
- EMA trend
- RSI condition
- Smart Money Concept (BOS, liquidity, supply/demand)

Jawab sangat singkat format:

Signal:
Trend:
RSI:
SMC:
Entry:
SL:
TP:
`
},
{
type: "image_url",
image_url: { url: image }
}
]
}
],
max_tokens: 180
})
});

const data = await response.json();

res.status(200).json({
result: data.choices[0].message.content
});
}
