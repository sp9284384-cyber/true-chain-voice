import Link from "next/link";
import Header from "@/components/shared/Header";
import { AlertTriangle } from "@/components/shared/icons";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container-page flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-text-faint" />
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-text-muted">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-secondary mt-6">
          Back to home
        </Link>
      </main>
    </div>
  );
}
