'use server'

import { revalidatePath } from "next/cache"

export async function createResume(formData: FormData) {
    const resume = formData.get('resume')
    const jobDescription = formData.get('jobDescription')

    console.log(resume, jobDescription)
}