import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-5 pt-32 text-center">
      <p className="ornament justify-center"><span className="eyebrow">Page not found</span></p>
      <h1 className="display mt-8 text-6xl sm:text-8xl">This table is empty.</h1>
      <p className="mt-6 text-muted-foreground">The page you are looking for has moved or no longer exists.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-gold">Back to home</Link>
        <Link href="/menu/" className="btn-line">See the menu</Link>
      </div>
    </section>
  );
}
