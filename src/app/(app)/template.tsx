"use client";
import { motion } from "framer-motion";

/** Chuyển trang mượt: mỗi lần đổi route, nội dung trượt nhẹ lên. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
