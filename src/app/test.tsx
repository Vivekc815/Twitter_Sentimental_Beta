'use client';

import { useState } from 'react';

export default function TestPage() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'Not set');
  const [testResult, setTestResult] = useState<string>('');

  const testConnection = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('Testing connection to:', url);
      
      const response = await fetch(`${url}/health`);
      const data = await response.json();
      
      setTestResult(`✅ Success! Server response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-4">
        <strong>NEXT_PUBLIC_API_URL:</strong> {apiUrl}
      </div>
      
      <button 
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Connection
      </button>
      
      {testResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{testResult}</pre>
        </div>
      )}
    </div>
  );
} 