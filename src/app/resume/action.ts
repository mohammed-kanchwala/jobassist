'use server'

import { revalidatePath } from "next/cache"

import { OpenAI } from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function matchFields(jsonData: string) {
    const prompt = `Match the following JSON data to appropriate resume sections:
    ${JSON.stringify(jsonData)}
    Provide output as a JSON with sections: personalInfo, education, workExperience, activities, projects, additional`

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
          messages: [
            {
              "role": "system",
              "content": [
                {
                  "type": "text",
                  "text": prompt
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

        console.log(response)
        const content = response.choices[0].message.content || ''
        console.log('content: ',content)
        return JSON.parse(content.replaceAll('```json\n', '').replaceAll('\n```', ''))
}

