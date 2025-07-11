import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Fetch poems from the API route
async function getRecentPoems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/poems`, {
    cache: "no-store", // Always fetch fresh data
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const poems = await getRecentPoems();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-2">
          <Link href="/" className="text-xl font-bold">
            nohaArchive
          </Link>
          <nav className="flex gap-4">
            <Link href="/poems" className="text-sm">
              All Poems
            </Link>
            <Link href="/poems/add" className="text-sm">
              Add Poem
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center text-center py-12 px-2">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Preserving Rare Urdu Poetry
        </h1>
        <p className="text-muted-foreground max-w-xl mb-6">
          nohaArchive is a community-driven project to collect and preserve
          nohas, qaseedas, and folk poetry that are at risk of being lost.
          Browse, search, and contribute to our growing archive.
        </p>
        <div className="flex gap-4">
          <Link href="/poems/add">
            <button className="btn btn-primary">Add a Poem</button>
          </Link>
          <Link href="/poems">
            <button className="btn btn-outline">Browse Poems</button>
          </Link>
        </div>
      </section>

      {/* Recent Submissions */}
      <section className="container mx-auto py-8 px-2 flex-1">
        <h2 className="text-2xl font-semibold mb-6">Recent Submissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {poems.length === 0 ? (
            <p className="col-span-3 text-center text-muted-foreground">
              No poems found.
            </p>
          ) : (
            poems.map((poem: any) => (
              <Card key={poem.id}>
                <CardHeader>
                  <CardTitle>
                    <span className="block text-lg">{poem.titleUrdu}</span>
                    <span className="block text-sm text-muted-foreground">
                      {poem.titleEn}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-xs uppercase text-muted-foreground">
                    {poem.type}
                  </p>
                  <p className="text-base line-clamp-3">{poem.contentUrdu}</p>
                  <Link
                    href={`/poems/${poem.id}`}
                    className="inline-block mt-4 text-primary underline text-sm"
                  >
                    Read More
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t mt-8">
        <div className="container mx-auto py-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} nohaArchive. Made with ❤️ for Urdu
          poetry.
        </div>
      </footer>
    </main>
  );
}
