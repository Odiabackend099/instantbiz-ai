import { Check, Clock, MessageSquare, Users, Zap, Star, Phone, Mail, MapPin, ArrowRight, Shield, TrendingUp } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedPhone } from "@/components/AnimatedPhone";
import { DemoChat } from "@/components/DemoChat";
import { NigerianTestimonials } from "@/components/NigerianTestimonials";
import { FloatingElements } from "@/components/FloatingElements";
import { CEO } from "@/components/CEO";
import { BankLogos } from "@/components/BankLogos";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const businessTypes = [
    { name: "Restaurants & Food", icon: "🍽️", description: "Handle orders, menu queries, and delivery", businesses: "2,500+ restaurants" },
    { name: "Fashion & Retail", icon: "👗", description: "Size checks, price lists, and order processing", businesses: "1,800+ boutiques" },
    { name: "Healthcare & Pharmacy", icon: "💊", description: "Drug availability, health consultations", businesses: "900+ pharmacies" },
    { name: "Beauty & Salon", icon: "💄", description: "Appointment booking and service info", businesses: "1,200+ salons" },
    { name: "Education & Training", icon: "📚", description: "Course info and enrollment assistance", businesses: "600+ schools" },
    { name: "Professional Services", icon: "💼", description: "Consultation booking and service details", businesses: "1,100+ services" },
  ];

  const stats = [
    { number: "2M+", label: "Messages Processed Daily", subtext: "Growing by 15% monthly" },
    { number: "8,000+", label: "Active Nigerian Businesses", subtext: "Across all 36 states" },
    { number: "99.9%", label: "Uptime Guarantee", subtext: "Always reliable" },
    { number: "24/7", label: "Customer Support", subtext: "Human + AI powered" },
  ];

  const benefits = [
    { 
      icon: <MessageSquare className="h-8 w-8" />, 
      title: "Instant Responses", 
      description: "Your customers get immediate answers in Nigerian Pidgin, English, or Yoruba. No more 'I'll get back to you'",
      metric: "< 2 seconds response time"
    },
    { 
      icon: <Clock className="h-8 w-8" />, 
      title: "24/7 Availability", 
      description: "Never miss a customer again. Lexi works round the clock, even when you're sleeping or in church.",
      metric: "365 days a year"
    },
    { 
      icon: <Users className="h-8 w-8" />, 
      title: "Handle Multiple Customers", 
      description: "Serve hundreds of customers simultaneously without hiring additional staff or assistants.",
      metric: "Up to 1000 chats"
    },
    { 
      icon: <TrendingUp className="h-8 w-8" />, 
      title: "Boost Sales by 300%", 
      description: "Businesses using Lexi see an average 300% increase in online sales within 30 days.",
      metric: "Proven results"
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-whatsapp-light via-white to-nigeria-light overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <FloatingElements />
        
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] px-6 py-3 rounded-full text-sm font-medium mb-8 border border-[#25D366]/20"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="h-4 w-4" />
              Nigeria's #1 AI Business Assistant
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="gradient-text">Imagine ChatGPT 5</span>
              <br />
              Saving Your Customers
              <br />
              <span className="text-[#25D366]">Even While You Sleep</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              Transform your WhatsApp into a 24/7 sales machine. Lexi AI handles customer inquiries, takes orders, and grows your business automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.a 
                href="https://wa.me/2348105786326?text=Hi! I want to start my 7-day free trial of Lexi AI for my business"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all inline-flex items-center gap-3 pulse-glow group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare className="h-5 w-5" />
                Start Free Trial Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              <motion.button 
                className="border-2 border-[#25D366] text-[#25D366] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#25D366] hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See Live Demo
              </motion.button>
            </div>
            
            {/* Trust badges */}
            <motion.div 
              className="flex flex-wrap gap-6 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: <Check className="h-5 w-5 text-[#25D366]" />, text: "7-day free trial" },
                { icon: <Shield className="h-5 w-5 text-[#25D366]" />, text: "Bank-level security" },
                { icon: <Star className="h-5 w-5 text-[#25D366]" />, text: "5-star rated" }
              ].map((badge, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg shadow-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  {badge.icon}
                  <span className="font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right Content - Animated Phone */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatedPhone />
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-20 bg-white snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Nigerian Businesses
            </h2>
            <p className="text-xl text-gray-600">Real results from real businesses across Nigeria</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[#25D366] mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.subtext}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-gray-50 to-white snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Nigerian Business Owners Choose Lexi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for Nigerian businesses with local context and language support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#25D366]/10 p-3 rounded-xl text-[#25D366] flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {benefit.description}
                    </p>
                    <div className="bg-[#25D366]/10 text-[#25D366] px-3 py-1 rounded-full text-sm font-medium inline-block">
                      {benefit.metric}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Live Demo Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-[#25D366]/5 to-white snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Try Lexi AI Right Now
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience how Lexi handles customer inquiries. Ask about prices, delivery, or anything else!
            </p>
          </motion.div>

          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <DemoChat />
          </motion.div>
        </div>
      </motion.section>

      {/* Nigerian Testimonials */}
      <NigerianTestimonials />

      {/* Business Types Section */}
      <motion.section 
        className="py-20 bg-white snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for Every Nigerian Business
            </h2>
            <p className="text-xl text-gray-600">From Lagos to Kano, from small shops to large enterprises</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {businessTypes.map((type, i) => (
              <motion.div 
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 mb-3">{type.description}</p>
                <div className="bg-[#25D366]/10 text-[#25D366] px-3 py-1 rounded-full text-sm font-medium">
                  {type.businesses}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-gray-50 to-white snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Setup Takes 60 Seconds
            </h2>
            <p className="text-xl text-gray-600">No technical skills needed. Start serving customers immediately</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Click WhatsApp",
                description: "No forms, no emails, no complicated signup process. Just click and start.",
                icon: "📱"
              },
              {
                step: "2", 
                title: "Answer 5 Questions",
                description: "Business type, name, what you sell, delivery options, and operating hours.",
                icon: "❓"
              },
              {
                step: "3",
                title: "Start Selling",
                description: "Your AI agent is ready! Share with customers and watch sales grow.",
                icon: "🚀"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-20 h-20 bg-[#25D366] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6"
                  whileHover={{ scale: 1.1 }}
                >
                  {item.step}
                </motion.div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-[#25D366]/10 to-white snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">One price, all features, no hidden fees</p>
            
            <div className="text-6xl md:text-7xl font-bold text-[#25D366] mb-4">₦20,000</div>
            <div className="text-xl text-gray-600 mb-8">per month (that's only ₦667 per day)</div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { title: "Free Trial", description: "7 full days", icon: "🎁" },
                { title: "Payment", description: "Bank transfer or card", icon: "💳" },
                { title: "Support", description: "Human + AI support", icon: "🤝" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="bg-gray-50 p-6 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                  <div className="text-gray-600">{item.description}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://wa.me/2348105786326?text=Hi! I want to start my 7-day free trial of Lexi AI for my business"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-12 py-6 rounded-xl text-xl font-bold transition-all inline-flex items-center gap-3 pulse-glow group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="h-6 w-6" />
              Try Free for 7 Days
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Cancel anytime • Setup in 60 seconds
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CEO Section */}
      <motion.section 
        className="snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <CEO />
      </motion.section>

      {/* Bank Logos */}
      <motion.section 
        className="snap-start"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <BankLogos />
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-[#25D366]">Lexi AI</h3>
              <p className="text-gray-400 mb-4">
                Nigeria's leading AI business assistant for WhatsApp. Built by Nigerians, for Nigerians.
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-lg">🇳🇬</span>
                <span>Proudly Nigerian</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Setup Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+234 810 578 6326</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@lexi.ng</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lexi AI. All rights reserved. Built for Nigerian infrastructure - works on 2G networks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;