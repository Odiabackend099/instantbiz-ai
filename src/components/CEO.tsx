import { motion } from "framer-motion";

export function CEO() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-whatsapp/5">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* CEO Image */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-whatsapp rounded-3xl transform rotate-3"></div>
                <img 
                  src="/lovable-uploads/936fedad-d520-4096-bde5-5989d1c521dc.png"
                  alt="Austyn Eguale, CEO of Lexi AI"
                  className="relative w-full rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-xl">
                  <div className="text-2xl">🚀</div>
                </div>
              </div>
            </motion.div>

            {/* CEO Statement */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  Imagine ChatGPT-5 
                  <span className="bg-gradient-to-r from-primary to-whatsapp bg-clip-text text-transparent">
                    {" "}Saving Your Customers
                  </span>
                  <br />
                  Even While You Sleep
                </h2>
                
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-whatsapp rounded-full"></div>
              </div>

              <blockquote className="text-xl lg:text-2xl text-muted-foreground leading-relaxed italic">
                "In Nigeria, every missed customer call is lost revenue. With Lexi AI, your business never sleeps. 
                We're not just building chatbots – we're creating the future where every Nigerian business, 
                from Mama Put to million-naira enterprises, can compete globally."
              </blockquote>

              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">Austyn Eguale</div>
                <div className="text-lg text-primary font-semibold">CEO & Founder, Lexi AI</div>
                <div className="text-muted-foreground">Former Meta Engineer • Stanford MBA</div>
              </div>

              <motion.div 
                className="flex flex-wrap gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-primary">10,000+</div>
                  <div className="text-sm text-muted-foreground">Businesses Served</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-whatsapp">₦2.5B+</div>
                  <div className="text-sm text-muted-foreground">Revenue Generated</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-nigeria-green">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </motion.div>

              <motion.div 
                className="pt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-primary to-whatsapp p-6 rounded-2xl text-white">
                  <h3 className="text-xl font-bold mb-3">How Lexi AI Works:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="mr-2">💬</span>
                      Integrates with WhatsApp, Instagram, and your website
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🧠</span>
                      AI learns your business in 5 minutes
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🔄</span>
                      Handles 90% of customer inquiries automatically
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">📈</span>
                      Increases sales by 300% on average
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}