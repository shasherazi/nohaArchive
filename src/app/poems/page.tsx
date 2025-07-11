import AllPoemsClient from "./AllPoemsClient";

export default function AllPoemsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">All Poems</h1>
      <AllPoemsClient />
    </div>
  );
}
