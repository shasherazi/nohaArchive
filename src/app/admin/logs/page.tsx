"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Moderation Logs</h1>
      {loading ? (
        <div>Loading...</div>
      ) : logs.length === 0 ? (
        <div>No logs found.</div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <Card
              key={log.id}
              className="p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-semibold">
                  {log.admin?.name || "Unknown Admin"}
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({log.admin?.email || "?"})
                  </span>
                </div>
                <div className="text-sm mt-1">
                  <span className="font-medium capitalize">{log.action}</span>{" "}
                  poem{" "}
                  <Link
                    href={`/poems/${log.poemId}`}
                    className="underline text-primary"
                  >
                    {log.poem?.titleUrdu || "Untitled"}
                  </Link>
                  {log.details && (
                    <span className="ml-2 text-muted-foreground">
                      ({log.details})
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2 md:mt-0">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-8">
        <Link href="/admin">
          <Button variant="outline">Back to Admin Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
