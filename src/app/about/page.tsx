export default function About() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">About nohaArchive</h1>
      <p className="mb-4">
        nohaArchive is a platform for preserving and archiving old nohas,
        qaseedas, and other writings. It is a community-driven platform where
        users can contribute by uploading their own nohas and qaseedas.
      </p>

      <h2 className="text-xl font-bold mb-2">Features</h2>
      <ul className="list-disc pl-4 mb-4">
        <li>Upload nohas and qaseedas</li>
        <li>Search for nohas and qaseedas</li>
        <li>Admin and moderator roles for managing content and users</li>
      </ul>
    </div>
  );
}
