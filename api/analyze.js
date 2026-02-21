export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";

export default async function handler(req, res) {

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {

    const image = fs.readFileSync(files.image.filepath);
    const base64Image = image.toString("base64");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [{
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Analisa chart forex ini. Tentukan trend, entry, stop loss, take profit, dan confidence dalam persen."
            },
            {
              type: "input_image",
              image_url: `data:image/png;base64,${base64Image}`
            }
          ]
        }]
      })
    });

    const data = await response.json();

    res.status(200).json({
      analysis: data.output_text,
      originalImage: `data:image/png;base64,${base64Image}`
    });

  });
}
