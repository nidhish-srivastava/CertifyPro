import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Head>
        <title>CertifyPro - Easy Certificate Generation</title>
        <meta name="description" content="Generate professional certificates in seconds" />
      </Head>
      
      <main className="w-4/5 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">CertifyPro</h1>
          <p className="text-xl text-gray-700 mb-8">Generate professional certificates with ease</p>
          <div className="space-x-4">
            <Link href="/create" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
              Create Certificate
            </Link>
            {/* <Link href="/verify" className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition">
              Verify Certificate
            </Link> */}
          </div>
        </div>
        
      </main>
    </div>
  );
}