'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import React from 'react';
import Button from '@mui/material/Button';

type Exercise = {
  Exercise: string;
  Sets: number;
  Reps: number;
};

type DayExercises = {
  Exercises: Record<string, Exercise>;
};

type WorkoutProgram = {
  Week: Record<string, DayExercises>;
};

type TestItem = {
  id: number;
  name: string;
  note: string;
};

export default function TestPage() {
  const [items, setItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('test_items').select('*');
      if (error) console.error('Error fetching data:', error);
      else setItems(data || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleButtonClick = async () => {
    try {
      const response = await fetch('/api/programs');
      const data = await response.json();
      if (data.Week) {
        setProgram(data);
      } else {
        console.error('No program data from API');
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Items</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="p-4 border rounded shadow">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.note}</p>
            </li>
          ))}
        </ul>
      )}
      <Button variant="contained" onClick={handleButtonClick}>
        Load Workout Program
      </Button>

      {program && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Weekly Workout Program</h2>
          <div className="space-y-4">
            {Object.entries(program.Week).map(([day, dayExercises]) => (
              <div key={day} className="p-4 border rounded shadow">
                <h3 className="text-lg font-semibold">{day}</h3>
                <ul className="mt-2 space-y-2">
                  {Object.entries(dayExercises.Exercises).map(([key, exercise]) => (
                    <li key={key}>
                      <p>
                        <strong>Exercise:</strong> {exercise.Exercise}
                      </p>
                      <p>
                        <strong>Sets:</strong> {exercise.Sets}, <strong>Reps:</strong> {exercise.Reps}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
