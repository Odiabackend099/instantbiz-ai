import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const messages = [
  { type: "customer", text: "Good evening, do you have ankara dresses?", delay: 0 },
  { type: "lexi", text: "Good evening! Yes ma! We have beautiful ankara collection 👗", delay: 1500 },
  { type: "lexi", text: "Premium Ankara - ₦15,000\nCasual Ankara - ₦8,500\nCorporate Ankara - ₦12,000", delay: 2500 },
  { type: "customer", text: "Size 14 available?", delay: 4000 },
  { type: "lexi", text: "Yes ma! Size 14 dey available. You wan see pictures?", delay: 5000 },
  { type: "lexi", isVoice: true, delay: 6000 },
  { type: "customer", text: "How much for delivery to Victoria Island?", delay: 7500 },
  { type: "lexi", text: "Delivery to VI na ₦2,000. Same day delivery if you order before 3pm", delay: 8500 }
];

export function AnimatedPhone() {
  const [visibleMessages, setVisibleMessages] = useState<typeof messages>([]);
  const [typingVisible, setTypingVisible] = useState(false);
  
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    messages.forEach((msg, index) => {
      const timeout = setTimeout(() => {
        if (index < messages.length - 1) {
          setTypingVisible(true);
          setTimeout(() => setTypingVisible(false), 1000);
        }
        setVisibleMessages(prev => [...prev, msg]);
      }, msg.delay);
      timeouts.push(timeout);
    });

    // Reset animation after completion
    const resetTimeout = setTimeout(() => {
      setVisibleMessages([]);
      setTypingVisible(false);
    }, 12000);
    timeouts.push(resetTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div 
      className="relative mx-auto w-[320px] h-[640px] floating-phone"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* iPhone Frame */}
      <div className="absolute inset-0 bg-black rounded-[40px] shadow-2xl border-8 border-gray-800">
        <div className="absolute inset-[3px] bg-white rounded-[37px] overflow-hidden">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] h-16 flex items-center px-4 text-white relative">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-green-300 to-green-500 rounded-full mr-3 flex items-center justify-center text-white font-bold text-sm"
              whileHover={{ scale: 1.1 }}
            >
              MN
            </motion.div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Mama Nkechi Boutique</div>
              <div className="text-xs opacity-80 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                {typingVisible ? "Lexi is typing..." : "online"}
              </div>
            </div>
            <div className="flex space-x-3">
              <motion.div whileHover={{ scale: 1.2 }} className="w-6 h-6 text-white">📞</motion.div>
              <motion.div whileHover={{ scale: 1.2 }} className="w-6 h-6 text-white">📹</motion.div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="h-[calc(100%-4rem)] bg-gradient-to-b from-[#e5ddd5] to-[#d9d3c8] p-3 overflow-y-auto">
            {visibleMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`mb-3 ${msg.type === 'customer' ? 'text-right' : 'text-left'}`}
              >
                {msg.isVoice ? (
                  <motion.div 
                    className="inline-block bg-[#DCF8C6] p-3 rounded-lg shadow-sm border border-green-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-4 h-4"
                      >
                        🎤
                      </motion.div>
                      <div className="text-sm">Voice message</div>
                      <div className="text-xs text-gray-600">0:03</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className={`inline-block p-3 rounded-lg max-w-[80%] shadow-sm ${
                      msg.type === 'customer' 
                        ? 'bg-[#DCF8C6] border border-green-200' 
                        : 'bg-white border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-sm whitespace-pre-line">{msg.text}</div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
            
            {typingVisible && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-left mb-3"
              >
                <div className="inline-block bg-white p-3 rounded-lg shadow-sm">
                  <motion.div 
                    className="flex space-x-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Chat Input Area */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#f0f0f0] p-2 flex items-center">
            <div className="flex-1 bg-white rounded-full px-3 py-2 text-sm text-gray-500">
              Type a message...
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-2 w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center text-white"
            >
              🎤
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* iPhone Notch */}
      <div className="absolute top-[3px] left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
      
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-50"></div>
    </motion.div>
  );
}