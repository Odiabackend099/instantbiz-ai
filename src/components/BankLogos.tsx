import { motion } from "framer-motion";
import firstBankLogo from "@/assets/banks/firstbank.png";
import gtBankLogo from "@/assets/banks/gtbank.png";
import ubaLogo from "@/assets/banks/uba.png";
import accessBankLogo from "@/assets/banks/accessbank.png";
import zenithBankLogo from "@/assets/banks/zenithbank.png";

const banks = [
  { name: "First Bank", logo: firstBankLogo },
  { name: "GTBank", logo: gtBankLogo },
  { name: "UBA", logo: ubaLogo },
  { name: "Access Bank", logo: accessBankLogo },
  { name: "Zenith Bank", logo: zenithBankLogo },
];

export function BankLogos() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Trusted Payment Partners
          </h3>
          <p className="text-muted-foreground">
            Secure transactions with Nigeria's leading banks
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {banks.map((bank, index) => (
            <motion.div
              key={bank.name}
              className="group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 w-32 h-32 flex items-center justify-center">
                <img
                  src={bank.logo}
                  alt={`${bank.name} logo`}
                  className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
                />
              </div>
              <p className="text-center mt-3 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {bank.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>256-bit SSL encryption • PCI DSS compliant</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}