'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

type TestItem = {
  id: number
  name: string
  note: string
}

export default function TestPage() {
  const [items, setItems] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('test_items').select('*')
      if (error) console.error('Error fetching data:', error)
      else setItems(data || [])
      setLoading(false)
    }

    fetchData()
  }, [])

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
    </div>
  )
}
