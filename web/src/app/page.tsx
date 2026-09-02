import Link from "next/link";

export default function RootPage() {
  return (
    <main className="root-landing">
      <span className="section-kicker">Medical Component Market</span>
      <h1>Choose a language</h1>
      <p>Open the static research-oriented component registry.</p>
      <nav aria-label="Language selection">
        <Link href="/en/">English</Link>
        <Link href="/zh/">中文</Link>
      </nav>
    </main>
  );
}
