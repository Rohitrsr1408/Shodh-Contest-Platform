module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        //
        // --- THIS IS THE FIX ---
        // Added a "/" between "api" and ":path*"
        //
        destination: "http://backend:8080/api/:path*",
      },
    ];
  },
};
