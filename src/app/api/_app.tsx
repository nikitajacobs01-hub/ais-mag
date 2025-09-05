// import "@/styles/globals.css";
// import type { AppProps } from "next/app";
// import { useState, useEffect } from "react";
// import LoadingSpinner from "@/components/LoadingSpinner";

// export default function MyApp({ Component, pageProps }: AppProps) {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   return <Component {...pageProps} />;
// }
