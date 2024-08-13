"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: "user" | "moderator" | "admin";
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      const usersQuery = query(collection(db, "users"));
      const querySnapshot = await getDocs(usersQuery);
      const fetchedUsers = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as User)
      );
      setUsers(fetchedUsers);
      setLoading(false);
    }

    fetchUsers();
  }, []);

  const updateUserRole = async (
    userId: string,
    newRole: "user" | "moderator" | "admin"
  ) => {
    await updateDoc(doc(db, "users", userId), { role: newRole });
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || currentUser.role !== "admin") {
    return <div>Access denied. You must be an admin to view this page.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.email} {user.displayName && user.displayName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Current Role: {user.role}</p>
            </CardContent>
            <CardFooter>
              <Select
                onValueChange={(value) =>
                  updateUserRole(
                    user.id,
                    value as "user" | "moderator" | "admin"
                  )
                }
                defaultValue={user.role}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
