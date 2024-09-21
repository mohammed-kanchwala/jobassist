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
      'x-rapidapi-key': 'ef3fe15e26mshaacb9fea0732e53p1c9327jsn66362460ee27',
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
    
    // Check if data.jobs exists and is an array
    if (Array.isArray(data.jobs)) {
      return {
        jobs: data.jobs.map((job: any) => ({
          id: job.id,
          company: job.company,
          image: job.image,
          title: job.title,
          description: job.description,
          location: job.location,
          employmentType: job.employmentType,
          datePosted: job.datePosted,
          salaryRange: job.salaryRange,
          url: job.jobProviders?.[0]?.url
        }))
      };
    } else {
      console.error('Unexpected API response structure:', data);
      return { error: 'Unexpected API response structure', data };
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { error: 'Failed to fetch jobs', details: error };
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