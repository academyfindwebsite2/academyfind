import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Profile not found</h1>
      <p className="mt-3 text-slate-600">
        This member does not exist or has made their profile private.
      </p>
      <Link href="/search" className="mt-6 inline-block font-semibold text-amber-700">
        Search AcademyFind →
      </Link>
    </main>
  );
}
