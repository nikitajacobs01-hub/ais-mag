"use client";

import { Loader2 } from "lucide-react"; // or any spinner icon
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#111111] text-[#FFcb74]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="h-12 w-12" />
      </motion.div>
      <span className="ml-4 text-xl font-semibold">Loading...</span>
    </div>
  );
}
