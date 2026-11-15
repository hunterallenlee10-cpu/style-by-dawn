import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap section">
      <h1 className="text-h1">This one&apos;s not on the rack.</h1>
      <p className="mt-6"><Link href="/" className="link">Back to the home page</Link></p>
    </div>
  );
}
