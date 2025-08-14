import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAIAnalytics } from "@/hooks/use-ai-analytics";

const demoResponses: Record<string, string> = {
  "hi": "Welcome to Mama Nkechi Boutique! 👗 How can I help you today?",
  "hello": "Good day! I'm Lexi, your AI assistant. What are you looking for?",
  "price": "Our dresses range from ₦8,000 to ₦25,000. Ankara styles start from ₦12,000. What style interests you?",
  "delivery": "We deliver same day within Lagos for ₦1,500! Victoria Island and Ikoyi delivery is ₦2,000.",
  "size": "We have sizes 8 to 18 available. Plus sizes 20-24 also available. What's your size?",
  "ankara": "Beautiful ankara collection! Premium ankara ₦15,000, Casual ₦8,500. Want to see pictures?",
  "gown": "Evening gowns ₦18,000-₦35,000. Casual gowns ₦12,000-₦20,000. Corporate gowns ₦15,000-₦25,000.",
  "payment": "We accept cash, transfer, and card payments. You can pay on delivery or before delivery.",
  "location": "We're located at 15 Balogun Market, Lagos Island. Open Mon-Sat 8AM-8PM.",
  default: "I can help with prices, sizes, delivery, payments, and product info. What would you like to know? Try asking about 'ankara', 'delivery', or 'prices'."
};

const quickButtons = ["Prices", "Delivery", "Sizes", "Ankara Styles", "Payment"];

export function DemoChat() {
  const { trackInteraction } = useAIAnalytics();
  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hi! I'm Lexi from Mama Nkechi Boutique. Try asking about prices, delivery, or our ankara collection!" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (message?: string) => {
    const messageText = message || input.trim();
    if (!messageText) return;
    
    const startTime = Date.now();
    
    // Add user message
    setMessages(prev => [...prev, { type: "user", text: messageText }]);
    setTyping(true);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const responseTime = Date.now() - startTime;
      const response = Object.keys(demoResponses).find(key => 
        messageText.toLowerCase().includes(key)
      );
      
      const botResponse = demoResponses[response] || demoResponses.default;
      
      setMessages(prev => [...prev, { 
        type: "bot", 
        text: botResponse
      }]);
      setTyping(false);
      
      // Track AI interaction performance
      trackInteraction({ 
        responseTime,
        wasResolved: response !== undefined,
        wasConverted: messageText.toLowerCase().includes('buy') || messageText.toLowerCase().includes('order'),
        userRating: Math.random() > 0.7 ? 5 : 4 // Simulate high satisfaction
      });
    }, 1200);
  };

  const handleQuickButton = (buttonText: string) => {
    handleSend(buttonText.toLowerCase());
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* WhatsApp-style header */}
      <div className="bg-[#075E54] p-4 text-white">
        <div className="flex items-center">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-green-300 to-green-500 rounded-full mr-3 flex items-center justify-center text-white font-bold"
            whileHover={{ scale: 1.1 }}
          >
            L
          </motion.div>
          <div>
            <div className="font-semibold">Lexi AI Demo</div>
            <div className="text-xs flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              {typing ? "typing..." : "Try me out!"}
            </div>
          </div>
          <div className="ml-auto">
            <div className="w-6 h-6 text-green-300">🤖</div>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 bg-gradient-to-b from-[#e5ddd5] to-[#d9d3c8]">
        {messages.map((msg, i) => (
          <motion.div 
            key={i} 
            className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`inline-block p-3 rounded-lg max-w-[85%] shadow-sm ${
              msg.type === 'user' 
                ? 'bg-[#DCF8C6] border border-green-200' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="text-sm">{msg.text}</div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        
        {typing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Action Buttons */}
      <div className="p-2 bg-gray-50 border-t">
        <div className="flex flex-wrap gap-1">
          {quickButtons.map((button) => (
            <motion.button
              key={button}
              onClick={() => handleQuickButton(button)}
              className="px-3 py-1 bg-[#25D366] text-white text-xs rounded-full hover:bg-[#128C7E] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {button}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Input */}
      <div className="p-3 bg-white flex items-center border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full mr-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
        />
        <motion.button 
          onClick={() => handleSend()}
          className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#128C7E] transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}