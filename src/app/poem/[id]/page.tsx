'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Poem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function PoemPage() {
  const { id } = useParams()
  const [poem, setPoem] = useState<Poem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPoem() {
      if (typeof id !== 'string') return;
      const poemDoc = doc(db, 'poems', id)
      const poemSnapshot = await getDoc(poemDoc)
      if (poemSnapshot.exists()) {
        setPoem({ id: poemSnapshot.id, ...poemSnapshot.data() } as Poem)
      }
      setLoading(false)
    }

    fetchPoem()
  }, [id])

  if (loading) {
    return <div>Loading poem...</div>
  }

  if (!poem) {
    return <div>Poem not found</div>
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>{poem.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">Category: {poem.category}</p>
          <p className="whitespace-pre-wrap">{poem.content}</p>
          <p className="text-sm text-gray-500 mt-4">
            Submitted on: {new Date(poem.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}