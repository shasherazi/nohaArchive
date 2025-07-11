// types/poem.ts

export type PoemType = "noha" | "qaseeda" | "folk";

export interface Poem {
  id: number;
  type: PoemType;
  titleUrdu: string;
  titleEn?: string;
  contentUrdu: string;
  contentEn?: string;
  poet?: string;
  year?: number;
  status: "pending" | "approved" | "rejected";
  submittedById?: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
