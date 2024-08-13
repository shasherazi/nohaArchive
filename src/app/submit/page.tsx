'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SubmitPoem() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const user = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('You must be logged in to submit a noha/qaseeda.')
      return
    }

    try {
      await addDoc(collection(db, 'poems'), {
        title,
        content,
        category,
        authorId: user.uid,
        createdAt: new Date().toISOString(),
        status: 'pending'
      })
      router.push('/') // Redirect to home page after successful submission
    } catch (error) {
      setError('Failed to submit the noha/qaseeda. Please try again.')
      console.error(error)
    }
  }

  if (!user) {
    return <p>Please log in to submit a noha or qaseeda.</p>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Submit a Noha or Qaseeda</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-1">Noha Content</label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1">Category</label>
          <Select onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="noha">Noha</SelectItem>
              <SelectItem value="qaseeda">Qaseeda</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Submit Noha or Qaseeda</Button>
      </form>
    </div>
  )
}