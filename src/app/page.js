import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Head>
        <title>CertifyPro - Professional Certificate Generation</title>
        <meta name="description" content="Create beautiful, professional certificates in seconds with our easy-to-use platform" />
        <meta name="keywords" content="certificate generator, digital certificates, online certificates, professional certificates" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="w-full py-4 px-6 md:px-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Replace with your actual logo */}
            <span className="text-2xl font-bold text-indigo-900">CertifyPro</span>
          </div>
          {/* <nav>
            <Link href="/login" className="text-indigo-700 hover:text-indigo-900">
              Sign In
            </Link>
          </nav> */}
        </div>
      </header>
      
      <main className="w-4/5 container mx-auto px-4 py-12 md:py-16">
        <div className="md:flex md:items-center md:space-x-12">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">Create Professional Certificates in Minutes</h1>
            <p className="text-xl text-gray-700 mb-8">No design skills needed. Our simple interface lets you generate beautiful certificates with just a few clicks.</p>
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row md:items-center">
              <Link href="/create" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition text-center">
                Create Your Certificate
              </Link>
              {/* <Link href="/templates" className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition text-center mt-4 md:mt-0">
                View Templates
              </Link> */}
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
              {/* Replace with your actual certificate preview image */}
              <div className="absolute inset-0 bg-white p-6 flex items-center justify-center">
                <div className="border-8 border-indigo-100 p-8 w-full h-full flex flex-col items-center justify-center">
                  <div className="text-indigo-800 font-serif text-lg md:text-2xl mb-2">Certificate of Achievement</div>
                  <div className="text-gray-500 text-xs md:text-sm mb-4">This certifies that</div>
                  <div className="text-indigo-900 font-bold text-lg md:text-2xl mb-2">John Doe</div>
                  <div className="text-gray-500 text-xs md:text-sm mb-4">has successfully completed</div>
                  <div className="text-indigo-800 font-medium text-base md:text-xl">Web Development Course</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Choose a Template</h3>
              <p className="text-gray-600 text-center">Select from our collection of professionally designed certificate templates</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Customize Content</h3>
              <p className="text-gray-600 text-center">Add recipient names, course details, dates and customize colors to fit your brand</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Download & Share</h3>
              <p className="text-gray-600 text-center">Download your certificate as a PDF or image file, ready to print or share digitally</p>
            </div>
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6">Ready to create your certificate?</h2>
          <Link href="/create" className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-lg font-medium hover:bg-indigo-700 transition text-lg">
            Get Started Now
          </Link>
        </div>
      </main>
      
      <footer className="bg-indigo-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} CertifyPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}