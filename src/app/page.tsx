"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PoetryText } from "@/components/PoetryText";
import Head from "next/head";

interface Poem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function Home() {
  const [featuredPoems, setFeaturedPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedPoems() {
      const poemsQuery = query(
        collection(db, "poems"),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const querySnapshot = await getDocs(poemsQuery);
      const fetchedPoems = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Poem)
      );
      setFeaturedPoems(fetchedPoems);
      setLoading(false);
    }

    fetchFeaturedPoems();
  }, []);

  return (
    <div className="space-y-6">
      <Head>
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
        <meta name="twitter:image" content="<generated>" />
        <meta name="twitter:image:type" content="<generated>" />
        <meta name="twitter:image:width" content="<generated>" />
        <meta name="twitter:image:height" content="<generated>" />
      </Head>
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome to nohaArchive</h2>
        <p className="text-xl">
          Preserving and archive old nohas, qaseedas and other writings.
        </p>
      </section>

      <section className="flex justify-center flex-wrap space-x-4">
        <Button asChild>
          <Link href="/browse">Browse Nohas and Qaseedas</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/submit">Submit a Noha or Qaseeda</Link>
        </Button>
      </section>

      <section className="buy-me-a-coffee">
        Support this website by buying me a coffee.{" "}
        <a href="https://www.buymeacoffee.com/syedhassanaskri" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style={{ height: "50px", display: "inline" }}
          />
        </a>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">
          Featured Nohas and Qaseedas
        </h3>
        {loading ? (
          <p>Loading featured nohas and qaseedas...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPoems.map((poem) => (
              <Card key={poem.id}>
                <CardHeader>
                  <CardTitle>
                    <PoetryText>{poem.title}</PoetryText>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">
                    Category: {poem.category}
                  </p>
                  <div className="whitespace-pre-wrap line-clamp-3 mb-4">
                    <PoetryText>{poem.content}</PoetryText>
                  </div>
                  <Button asChild>
                    <Link href={`/poem/${poem.id}`}>Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!loading && featuredPoems.length === 0 && (
          <p>No featured nohas or qaseedas available at the moment.</p>
        )}
      </section>
    </div>
  );
}
