import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome to nohaArchive</h2>
        <p className="text-xl">Preserving and celebrating Urdu folk poetry</p>
      </section>

      <section className="flex justify-center space-x-4">
        <Button asChild>
          <Link href="/browse">Browse Poems</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/submit">Submit a Poem</Link>
        </Button>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Featured Poems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Placeholder for featured poems */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="border p-4 rounded-md">
              <h4 className="font-semibold">Featured Poem {i}</h4>
              <p>Preview of the poem...</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}