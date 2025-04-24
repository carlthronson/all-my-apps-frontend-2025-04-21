// const cors = require('cors');
// import type { NextConfig } from "next";

module.exports = {
  reactStrictMode: true,
  // env: {
  //   MODE: 'LIVE',
  // },
  async rewrites() {
    return [
      {
        source: '/api/rest/:path*',
        // destination: 'https://devils-lake-backend.onrender.com/:path*' // Proxy to Backend
        // destination: 'http://localhost:8082/:path*'
        destination: 'https://all-my-apps-backend-2025-04-09.onrender.com/:path*'
      }
    ]
  },
  async headers() {
    return [
      {
        // Allow requests from all domains
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

// Enable CORS for all API routes
// const handler = (req, res) => {
//   // Set CORS headers
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   // Handle API requests
//   res.status(200).json({ name: 'John Doe' });
// };

// export default handler;
