import { NextResponse } from 'next/server';

export async function fetchJobs(filters: any) {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      'x-rapidapi-host': process.env.RAPIDAPI_HOST || '',
    }
  };

  const queryParams = new URLSearchParams({
    query: filters.query || 'Web Developer',
    location: filters.location || 'India',
    distance: filters.distance || '1.0',
    language: 'en_GB',
    remoteOnly: filters.remoteOnly || 'true',
    datePosted: filters.datePosted || 'month',
    employmentTypes: filters.employmentTypes || 'fulltime;parttime;intern;contractor',
    index: '0'
  });

  const url = `${process.env.RAPIDAPI_URL}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}