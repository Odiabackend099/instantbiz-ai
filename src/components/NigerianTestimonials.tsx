import { motion } from "framer-motion";

const testimonials = [
  {
    business: "Mama Put Restaurant",
    location: "Yaba, Lagos",
    owner: "Mrs. Adebayo Folake",
    message: "Lexi don help me serve 200 more customers this month! Customer fit order jollof rice 24/7 now.",
    revenue: "₦2.5M monthly",
    image: "🍛",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    business: "Divine Grace Pharmacy", 
    location: "Ikeja, Lagos",
    owner: "Pharm. Okonkwo Chidi",
    message: "Patients can check drug availability 24/7 now. Lexi even reminds them about refills!",
    revenue: "₦5M monthly",
    image: "💊",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    business: "Iya Rashidat Tailoring",
    location: "Balogun Market, Lagos",
    owner: "Mrs. Rashidat Adebisi",
    message: "Now I can take orders even when I'm busy sewing. Customers love the quick responses!",
    revenue: "₦1.8M monthly",
    image: "✂️",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    business: "Fresh Provisions Store",
    location: "Surulere, Lagos", 
    owner: "Mr. Emeka Nwafor",
    message: "Sales increased 150%! Customers can check prices and order groceries anytime.",
    revenue: "₦3.2M monthly",
    image: "🛒",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    business: "Beauty Palace Salon",
    location: "Victoria Island, Lagos",
    owner: "Miss Toke Adegoke",
    message: "Appointment booking is now automated. Lexi even sends reminders to clients!",
    revenue: "₦4M monthly",
    image: "💅",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  {
    business: "Buka Express",
    location: "Lekki Phase 1, Lagos",
    owner: "Chef Ngozi Okoli",
    message: "Orders increased by 300%! Lexi handles everything - menu, prices, delivery details.",
    revenue: "₦6M monthly",
    image: "🍽️",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  }
];

export function NigerianTestimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-nigeria-light to-whatsapp-light overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real Nigerian Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how businesses across Lagos are transforming customer service with Lexi AI
          </p>
        </motion.div>

        {/* Auto-scrolling testimonials */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-6"
              animate={{ x: [0, -100 * (testimonials.length / 2) + "%"] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <motion.div 
                  key={i}
                  className={`min-w-[350px] p-6 ${testimonial.bgColor} rounded-2xl shadow-lg border ${testimonial.borderColor} relative`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-4xl mb-4">{testimonial.image}</div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{testimonial.business}</h3>
                    <p className="text-sm text-gray-600 mb-1">{testimonial.location}</p>
                    <p className="text-sm font-medium text-gray-700">{testimonial.owner}</p>
                  </div>
                  
                  <blockquote className="text-gray-800 mb-4 italic">
                    "{testimonial.message}"
                  </blockquote>
                  
                  <div className="flex justify-between items-center">
                    <div className="bg-[#25D366] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {testimonial.revenue}
                    </div>
                    <div className="flex text-yellow-400">
                      {"⭐".repeat(5)}
                    </div>
                  </div>
                  
                  {/* WhatsApp verified badge */}
                  <div className="absolute top-4 right-4 bg-[#25D366] text-white p-1 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-nigeria-light to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-whatsapp-light to-transparent pointer-events-none"></div>
        </div>

        {/* Stats section */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { number: "500+", label: "Businesses Using Lexi" },
            { number: "50K+", label: "Happy Customers" },
            { number: "24/7", label: "Always Available" },
            { number: "99%", label: "Customer Satisfaction" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-[#25D366] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}