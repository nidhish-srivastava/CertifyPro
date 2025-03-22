"use client"

// pages/create.js - Updated with signature upload feature
import { useState, useRef } from 'react';
import Head from 'next/head';
import { toPng } from 'html-to-image';
import Link from 'next/link';

export default function Create() {
  const [certificateData, setCertificateData] = useState({
    recipientName: '',
    certificateTitle: '',
    issuerName: '',
    date: new Date().toISOString().split('T')[0],
    message: '',
    signature: null,
    signatureMethod: 'draw' // 'draw' or 'upload'
  });

  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const certificateRef = useRef(null);
  const signatureRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signaturePoints, setSignaturePoints] = useState([]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificateData(prev => ({ ...prev, [name]: value }));
  };
  
  // Toggle between drawing and uploading signature
  const toggleSignatureMethod = (method) => {
    setCertificateData(prev => ({ ...prev, signatureMethod: method }));
    if (method === 'draw') {
      setCertificateData(prev => ({ ...prev, signature: null }));
    }
  };
  
  // Signature pad functionality
  const startDrawing = (e) => {
    const canvas = signatureRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setSignaturePoints([{ x, y }]);
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = signatureRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSignaturePoints(prev => [...prev, { x, y }]);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(signaturePoints[0].x, signaturePoints[0].y);
    
    for (let i = 1; i < signaturePoints.length; i++) {
      ctx.lineTo(signaturePoints[i].x, signaturePoints[i].y);
    }
    
    ctx.stroke();
  };
  
  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = signatureRef.current;
      const signatureDataURL = canvas.toDataURL('image/png');
      setCertificateData(prev => ({ ...prev, signature: signatureDataURL }));
    }
  };
  
  const clearSignature = () => {
    if (certificateData.signatureMethod === 'draw') {
      const canvas = signatureRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignaturePoints([]);
    }
    setCertificateData(prev => ({ ...prev, signature: null }));
  };
  
  // Handle signature image upload
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCertificateData(prev => ({ ...prev, signature: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Download certificate as PNG
  const downloadCertificate = () => {
    if (certificateRef.current) {
      toPng(certificateRef.current)
        .then(dataUrl => {
          const link = document.createElement('a');
          link.download = `${certificateData.recipientName.replace(/\s+/g, '-')}-certificate.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch(error => {
          console.error('Error generating certificate:', error);
        });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Create Certificate | CertifyPro</title>
      </Head>
      
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">CertifyPro</Link>
            <div className="space-x-4">
              <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
              <Link href="/create" className="text-indigo-600 font-medium">Create</Link>
              <Link href="/verify" className="text-gray-600 hover:text-indigo-600">Verify</Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Your Certificate</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Certificate Details</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Template</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  className={`border p-2 rounded ${selectedTemplate === 'classic' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                  onClick={() => setSelectedTemplate('classic')}
                >
                  Classic
                </button>
                <button 
                  className={`border p-2 rounded ${selectedTemplate === 'modern' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                  onClick={() => setSelectedTemplate('modern')}
                >
                  Modern
                </button>
                <button 
                  className={`border p-2 rounded ${selectedTemplate === 'elegant' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
                  onClick={() => setSelectedTemplate('elegant')}
                >
                  Elegant
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={certificateData.recipientName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="John Doe"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Certificate Title</label>
              <input
                type="text"
                name="certificateTitle"
                value={certificateData.certificateTitle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Certificate of Achievement"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Issuer Name</label>
              <input
                type="text"
                name="issuerName"
                value={certificateData.issuerName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Company or Institution Name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={certificateData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                name="message"
                value={certificateData.message}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                placeholder="In recognition of outstanding achievement..."
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Signature</label>
              
              <div className="flex mb-3 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => toggleSignatureMethod('draw')}
                  className={`py-2 px-4 ${certificateData.signatureMethod === 'draw' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Draw Signature
                </button>
                <button
                  type="button"
                  onClick={() => toggleSignatureMethod('upload')}
                  className={`py-2 px-4 ${certificateData.signatureMethod === 'upload' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Upload Signature
                </button>
              </div>
              
              {certificateData.signatureMethod === 'draw' ? (
                <div className="border border-gray-300 rounded p-2 mb-2">
                  <canvas
                    ref={signatureRef}
                    width="400"
                    height="150"
                    className="w-full bg-white border border-gray-200"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                  ></canvas>
                </div>
              ) : (
                <div className="mb-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleSignatureUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-white border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Choose Image
                    </button>
                    <span className="ml-3 text-sm text-gray-500">
                      {certificateData.signature ? 'Image selected' : 'No image selected'}
                    </span>
                  </div>
                  {certificateData.signature && (
                    <div className="mt-2 border border-gray-200 p-2 rounded">
                      <img 
                        src={certificateData.signature} 
                        alt="Uploaded signature" 
                        className="h-20" 
                      />
                    </div>
                  )}
                </div>
              )}
              
              {certificateData.signature && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Clear Signature
                </button>
              )}
            </div>
            
            <button
              type="button"
              onClick={downloadCertificate}
              className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition"
            >
              Download Certificate
            </button>
          </div>
          
          {/* Preview */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <div 
              ref={certificateRef} 
              className={`w-full aspect-[1.4/1] border ${
                selectedTemplate === 'classic' ? 'border-gray-800' : 
                selectedTemplate === 'modern' ? 'border-none' : 
                'border-amber-800'
              } p-8 relative overflow-hidden`}
              style={{
                backgroundColor: selectedTemplate === 'classic' ? '#f9f7f1' : 
                                selectedTemplate === 'modern' ? '#ffffff' : 
                                '#fffbeb',
                boxShadow: selectedTemplate === 'modern' ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              {/* Background pattern/design based on template */}
              {selectedTemplate === 'classic' && (
                <div className="absolute inset-0 border-8 border-double border-gray-800 m-4 pointer-events-none"></div>
              )}
              
              {selectedTemplate === 'elegant' && (
                <div className="absolute inset-0 border-4 border-amber-800 m-4 pointer-events-none"></div>
              )}
              
              {selectedTemplate === 'modern' && (
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              )}
              
              <div className="text-center relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className={`text-xl mb-2 ${
                    selectedTemplate === 'classic' ? 'text-gray-800 font-serif' : 
                    selectedTemplate === 'modern' ? 'text-indigo-600 font-sans' : 
                    'text-amber-800 font-serif'
                  }`}>
                    {certificateData.issuerName || 'Company Name'}
                  </div>
                  
                  <h2 className={`text-3xl font-bold mb-4 ${
                    selectedTemplate === 'classic' ? 'text-gray-800 font-serif' : 
                    selectedTemplate === 'modern' ? 'text-gray-800 font-sans' : 
                    'text-amber-900 font-serif'
                  }`}>
                    {certificateData.certificateTitle || 'Certificate of Achievement'}
                  </h2>
                  
                  <p className="text-lg mb-6">This is to certify that</p>
                  
                  <h3 className={`text-2xl font-bold mb-6 ${
                    selectedTemplate === 'classic' ? 'border-b border-gray-800 pb-2 inline-block' : 
                    selectedTemplate === 'modern' ? 'text-indigo-700' : 
                    'border-b-2 border-amber-800 pb-2 inline-block'
                  }`}>
                    {certificateData.recipientName || 'Recipient Name'}
                  </h3>
                  
                  {certificateData.message && (
                    <p className="text-md mb-6 max-w-lg mx-auto">{certificateData.message}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-center items-end mb-4">
                    <div className="text-center">
                      {certificateData.signature ? (
                        <img 
                          src={certificateData.signature} 
                          alt="Signature" 
                          className="h-16 mx-auto mb-2" 
                        />
                      ) : (
                        <div className="border-b border-gray-400 w-48 h-16 mb-2"></div>
                      )}
                      <p className="text-sm text-gray-600">Authorized Signature</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Issued on: {new Date(certificateData.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
