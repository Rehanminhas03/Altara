"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

// Module-level flag: the intro plays once per full page load, not on
// client-side navigations.
let played = false;

export function LoadingScreen() {
  const reduce = usePrefersReducedMotion();
  const [visible, setVisible] = useState(!played);

  useEffect(() => {
    if (played) return;
    played = true;
    const t = setTimeout(() => setVisible(false), reduce ? 200 : 900);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian"
          aria-hidden
        >
          <motion.div
            initial={reduce ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Image
              src="/logo/logo.png"
              alt="Altara Automotive"
              width={327}
              height={219}
              priority
              className="h-28 w-auto object-contain sm:h-36"
            />
            {!reduce && (
              <motion.div
                className="mx-auto mt-2 h-px bg-gradient-to-r from-transparent via-chrome-2 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "70%", opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
