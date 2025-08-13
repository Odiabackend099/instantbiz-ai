import { motion } from "framer-motion";

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating WhatsApp icons */}
      <motion.div
        className="absolute top-20 left-[10%] text-4xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        💬
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-[15%] text-3xl"
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        📱
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 left-[20%] text-2xl"
        animate={{
          y: [0, -25, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        🚀
      </motion.div>
      
      <motion.div
        className="absolute top-60 left-[60%] text-3xl"
        animate={{
          y: [0, -15, 0],
          x: [0, -8, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        ⚡
      </motion.div>
      
      <motion.div
        className="absolute bottom-60 right-[25%] text-2xl"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        💰
      </motion.div>

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#25D366]/20 to-[#075E54]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-nigeria/20 to-whatsapp/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 0.8, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}