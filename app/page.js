import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>ORTFlix</h1>
      <p>
        <Link href="/reservas">Ir a Mis reservas</Link>
      </p>
      <p>Para crear una reserva, entrá a Mis reservas y elegí una función.</p>
    </main>
  );
}
