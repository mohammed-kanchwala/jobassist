'use server'

import { NextResponse } from 'next/server';

import { OpenAI } from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function fetchJobs(filters: any) {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '5ca75ac692msh2b5941c0c623998p1cc3e8jsn0da75e09b686',
      'x-rapidapi-host': 'jobs-api14.p.rapidapi.com',
    }
  };

  const queryParams = new URLSearchParams({
    query: filters.query || 'Web Developer',
    location: filters.location || 'India',
    distance: '1.0',
    language: 'en_GB',
    remoteOnly: filters.remoteOnly || 'false',
    datePosted: filters.datePosted || 'month',
    employmentTypes: filters.employmentTypes || 'fulltime;parttime;intern;contractor',
    index: '0'
  });

  const url = `https://jobs-api14.p.rapidapi.com/list?${queryParams.toString()}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { jobs: data.jobs.map((job: any) => ({
      id: job.id,
      company: job.company,
      title: job.title,
      description: job.description,
      location: job.location,
      employmentType: job.employmentType,
      datePosted: job.datePosted,
      salaryRange: job.salaryRange,
    }))};
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { error: 'Failed to fetch jobs' };
  }
}


export async function customResume(jsonData: string, jobDescription: string) {
  const prompt = `user's resume's json:
                  ${JSON.stringify(jsonData)}
                  and Job Description: ${jobDescription}
                  I want to same jsonData as a output but modified to be more relevant to the job description
                  `

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
      console.log('response from openAI: ',content)
      return JSON.parse(content.replaceAll('```json\n', '').replaceAll('\n```', ''))
}