"use client"

import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import Head from 'next/head';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('png');
  
  const certificateRef = useRef(null);
  const signatureRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signaturePoints, setSignaturePoints] = useState([]);
  
  useEffect(() => {
    // Initialize canvas after component mount
    if (signatureRef.current && certificateData.signatureMethod === 'draw') {
      const canvas = signatureRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';
    }
  }, [certificateData.signatureMethod]);
  
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
      setSignaturePoints([]);
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
  
  // Download certificate as PNG or PDF
  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsDownloading(true);
      const fileName = `${certificateData.recipientName.replace(/\s+/g, '-') || 'certificate'}-${Date.now()}`;
      
      // Generate PNG
      const dataUrl = await toPng(certificateRef.current, { quality: 0.95 });
      
      if (downloadFormat === 'pdf') {
        // Convert to PDF
        const imgProps = await getImageDimensions(dataUrl);
        const pdf = new jsPDF({
          orientation: imgProps.width > imgProps.height ? 'landscape' : 'portrait',
          unit: 'mm',
        });
        
        // Calculate PDF dimensions to maintain aspect ratio
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);
      } else {
        // Download as PNG
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      }
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('There was an error generating your certificate. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Helper function to get image dimensions
  const getImageDimensions = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.src = dataUrl;
    });
  };
  
  // Template preview thumbnails
  const templatePreviews = {
    classic: "https://via.placeholder.com/100x70/f9f7f1/000000?text=Classic",
    modern: "https://via.placeholder.com/100x70/ffffff/5a67d8?text=Modern",
    elegant: "https://via.placeholder.com/100x70/fffbeb/92400e?text=Elegant"
  };
  
  return (
    <>
      <Head>
        <title>Create Certificate | CertifyPro</title>
        <meta name="description" content="Create and customize your own professional certificate" />
      </Head>
      
      <div className="min-h-screen px-6 bg-gradient-to-b from-indigo-50 to-white">
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-bold text-indigo-900">Create Your Certificate</h1>
            <div className="text-sm text-gray-500">Changes are saved automatically</div>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form - Left Side */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-indigo-900 mb-4">Certificate Details</h2>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Template Style</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['classic', 'modern', 'elegant'].map((template) => (
                        <div 
                          key={template}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            selectedTemplate === template ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <div className="aspect-video bg-gray-100 flex items-center justify-center">
                            <div 
                              className={`w-full h-full ${
                                template === 'classic' ? 'bg-[#f9f7f1] border border-gray-800' : 
                                template === 'modern' ? 'bg-white border-t-4 border-indigo-500' : 
                                'bg-[#fffbeb] border border-amber-800'
                              }`}
                            ></div>
                          </div>
                          <div className="py-1 px-2 text-xs font-medium text-center capitalize">
                            {template}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Certificate Title</label>
                      <input
                        type="text"
                        name="certificateTitle"
                        value={certificateData.certificateTitle}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Certificate of Achievement"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Recipient Name</label>
                      <input
                        type="text"
                        name="recipientName"
                        value={certificateData.recipientName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Issuer/Organization</label>
                      <input
                        type="text"
                        name="issuerName"
                        value={certificateData.issuerName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Company or Institution Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Date Issued</label>
                      <input
                        type="date"
                        name="date"
                        value={certificateData.date}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Message <span className="text-gray-500 text-xs">(Optional)</span>
                      </label>
                      <textarea
                        name="message"
                        value={certificateData.message}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="In recognition of outstanding achievement..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-indigo-900 mb-4">Signature</h2>
                  
                  <div className="mb-3">
                    <div className="flex rounded-md overflow-hidden border border-gray-300">
                      <button
                        type="button"
                        onClick={() => toggleSignatureMethod('draw')}
                        className={`flex-1 py-2 px-3 text-sm font-medium ${
                          certificateData.signatureMethod === 'draw'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Draw Signature
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSignatureMethod('upload')}
                        className={`flex-1 py-2 px-3 text-sm font-medium ${
                          certificateData.signatureMethod === 'upload'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Upload Signature
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {certificateData.signatureMethod === 'draw' ? (
                      <div className="border border-gray-300 rounded-md p-2 bg-white">
                        <div className="text-xs text-gray-500 mb-2">
                          Draw your signature below
                        </div>
                        <canvas
                          ref={signatureRef}
                          width="400"
                          height="150"
                          className="w-full bg-white border border-gray-200 rounded touch-none"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={endDrawing}
                          onMouseLeave={endDrawing}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            const touch = e.touches[0];
                            startDrawing({
                              clientX: touch.clientX,
                              clientY: touch.clientY
                            });
                          }}
                          onTouchMove={(e) => {
                            e.preventDefault();
                            const touch = e.touches[0];
                            draw({
                              clientX: touch.clientX,
                              clientY: touch.clientY
                            });
                          }}
                          onTouchEnd={endDrawing}
                        ></canvas>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleSignatureUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mb-2"
                          >
                            {certificateData.signature ? 'Change Signature Image' : 'Upload Signature Image'}
                          </button>
                          {certificateData.signature && (
                            <div className="mt-2 border border-gray-200 p-3 rounded-md bg-white">
                              <img 
                                src={certificateData.signature} 
                                alt="Uploaded signature" 
                                className="h-20 mx-auto" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {certificateData.signature && (
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Clear Signature
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-indigo-900 mb-4">Download Options</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Format</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          checked={downloadFormat === 'png'}
                          onChange={() => setDownloadFormat('png')}
                        />
                        <span className="ml-2">PNG Image</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-indigo-600"
                          checked={downloadFormat === 'pdf'}
                          onChange={() => setDownloadFormat('pdf')}
                        />
                        <span className="ml-2">PDF Document</span>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={downloadCertificate}
                    disabled={isDownloading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download {downloadFormat.toUpperCase()} Certificate
                      </>
                    )}
                  </button>
                  
                  {showSuccessMessage && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Certificate downloaded successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Preview - Right Side */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <div className="bg-white p-6 rounded-xl shadow-md mb-4">
                  <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    Certificate Preview
                  </h2>
                  
                  <div className="flex justify-center">
                    <div 
                      ref={certificateRef} 
                      className={`w-full max-w-3xl aspect-[1.4/1] border ${
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
                            {certificateData.issuerName || 'Organization Name'}
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
                
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-indigo-800">Tips</h3>
                      <div className="mt-1 text-sm text-indigo-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Add a signature to make your certificate look more official</li>
                          <li>Choose PDF format for printing or PNG for sharing online</li>
                          <li>All changes are automatically saved in the preview</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}