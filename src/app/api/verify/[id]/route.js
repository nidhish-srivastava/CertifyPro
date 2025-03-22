import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const id = params.id;
  
  // In a real app, you would look up the certificate in your database
  // For demo purposes, we'll just return a mock response
  
  return NextResponse.json({
    valid: true,
    certificate: {
      id: id,
      recipientName: "John Doe",
      certificateTitle: "Certificate of Excellence",
      issuerName: "Demo Company",
      issueDate: "2023-01-15",
      verificationDate: new Date().toISOString()
    }
  });
}