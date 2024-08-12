'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Poem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function BrowsePoems() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPoems() {
      const poemsQuery = query(
        collection(db, 'poems'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(poemsQuery)
      const fetchedPoems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Poem))
      setPoems(fetchedPoems)
      setLoading(false)
    }

    fetchPoems()
  }, [])

  if (loading) {
    return <div>Loading poems...</div>
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Browse Poems</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {poems.map((poem) => (
          <Card key={poem.id}>
            <CardHeader>
              <CardTitle>{poem.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">Category: {poem.category}</p>
              <p className="line-clamp-3">{poem.content}</p>
              <Button asChild className="mt-4">
                <Link href={`/poem/${poem.id}`}>Read More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}