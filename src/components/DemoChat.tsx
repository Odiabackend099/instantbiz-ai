import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

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
    
    // Add user message
    setMessages(prev => [...prev, { type: "user", text: messageText }]);
    setTyping(true);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const response = Object.keys(demoResponses).find(key => 
        messageText.toLowerCase().includes(key)
      );
      
      setMessages(prev => [...prev, { 
        type: "bot", 
        text: demoResponses[response] || demoResponses.default 
      }]);
      setTyping(false);
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
            className="w-10 h-10 bg-gradient-to-br from-green-300 to-green-500 rounded-full mr-3 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.1 }}
          >
            <img 
              src="/lovable-uploads/936fedad-d520-4096-bde5-5989d1c521dc.png" 
              alt="Lexi AI" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <div className="font-semibold">Lexi AI Demo</div>
            <div className="text-xs flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              {typing ? "typing..." : "online"}
            </div>
          </div>
          <div className="ml-auto flex items-center">
            <svg className="w-5 h-5 text-white mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.251"/>
            </svg>
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