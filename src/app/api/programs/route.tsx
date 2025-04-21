import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  const client = new OpenAI();
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-nano",
      input: `Please provide a weekly workout routine in valid JSON format, without any extra text or comments. Some days can be rest days. Program should be bodybuilding focused. Each lifting day should at least have 6 excercises with a maximum of 10.
        {
        "Week": {
            "Monday": {
            "Exercises": {
                "1": { "Exercise": "Pushups", "Sets": 3, "Reps": 10 },
                "2": { "Exercise": "Squats", "Sets": 3, "Reps": 10 }
            }
            },
            "Tuesday": {
            "Exercises": {
                "1": { "Exercise": "Running", "Sets": 1, "Reps": 30 }
            }
            }
        }
        // Include other days similarly
        }`
    });

    const aiOutput = response.output_text.trim();
    // Optional: Additional cleanup might be required depending on the response
    const cleanedOutput = aiOutput.replace(/```json/g, '').replace(/```/g, '');
    const program = JSON.parse(cleanedOutput);

    console.log('Response:', response);
    console.log('Program:', program);
    return NextResponse.json(program);
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    return NextResponse.json({ error: 'Error fetching data or parsing JSON' }, { status: 500 });
  }
}