// app/verify/page.js - Updated verification page with navigation
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Verify() {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleVerify = async () => {
    if (!certificateId.trim()) return;
    
    setIsVerifying(true);
    
    try {
      // Using the new App Router API routes
      const response = await fetch(`/api/verify/${certificateId}`);
      const data = await response.json();
      setVerificationResult(data);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({ valid: false, error: 'Failed to verify certificate' });
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">CertifyPro</Link>
            <div className="space-x-4">
              <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
              <Link href="/create" className="text-gray-600 hover:text-indigo-600">Create</Link>
              <Link href="/verify" className="text-indigo-600 font-medium">Verify</Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify Certificate</h1>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Certificate ID</label>
            <div className="flex">
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l"
                placeholder="Enter certificate ID"
              />
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="bg-indigo-600 text-white px-4 py-2 rounded-r font-medium hover:bg-indigo-700 transition disabled:bg-indigo-400"
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
          
          {verificationResult && (
            <div className={`p-4 rounded mb-4 ${verificationResult.valid ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
              {verificationResult.valid ? (
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="font-semibold text-green-800">Certificate Verified</h3>
                  </div>
                  <ul className="text-sm text-gray-700">
                    <li className="mb-1"><span className="font-medium">Recipient:</span> {verificationResult.certificate.recipientName}</li>
                    <li className="mb-1"><span className="font-medium">Title:</span> {verificationResult.certificate.certificateTitle}</li>
                    <li className="mb-1"><span className="font-medium">Issuer:</span> {verificationResult.certificate.issuerName}</li>
                    <li className="mb-1"><span className="font-medium">Issue Date:</span> {new Date(verificationResult.certificate.issueDate).toLocaleDateString()}</li>
                    <li><span className="font-medium">Verified On:</span> {new Date(verificationResult.certificate.verificationDate).toLocaleString()}</li>
                  </ul>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <h3 className="font-semibold text-red-800">Invalid Certificate</h3>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}