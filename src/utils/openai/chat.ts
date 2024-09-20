'use server'

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateResume(resume: any, jobDescription: any) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
          messages: [
            {
              "role": "system",
              "content": [
                {
                  "type": "text",
                  "text": "Generate a custom resume for the user based on the following resume " + resume + " and job description " + jobDescription
                }
              ]
            }
          ],
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: {
            "type": "text"
          },
        });
        
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
}
