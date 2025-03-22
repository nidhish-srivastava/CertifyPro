import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Head>
        <title>CertifyPro - Easy Certificate Generation</title>
        <meta name="description" content="Generate professional certificates in seconds" />
      </Head>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">CertifyPro</h1>
          <p className="text-xl text-gray-700 mb-8">Generate, sign, and verify professional certificates with ease</p>
          <div className="space-x-4">
            <Link href="/create" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
              Create Certificate
            </Link>
            <Link href="/verify" className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition">
              Verify Certificate
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Your existing feature boxes... */}
          {/* You might want to update the third box to be about verification instead of sharing */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Create</h2>
            <p className="text-gray-600 text-center">Design beautiful certificates with our easy-to-use templates</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Sign</h2>
            <p className="text-gray-600 text-center">Digitally sign certificates to add authenticity and security</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Verify</h2>
            <p className="text-gray-600 text-center">Easily authenticate certificates with our secure verification system</p>
          </div>
        </div>
      </main>
    </div>
  );
}