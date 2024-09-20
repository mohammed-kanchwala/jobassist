import { NextResponse } from 'next/server';

export async function fetchJobs(filters: any) {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '1816e3d3ccmsha37fa1fcd4e7794p111913jsne6835d4ecbfc',
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}