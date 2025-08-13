import { MessageCircle, Check, Zap, Clock, DollarSign, Users } from "lucide-react";

const Index = () => {
  const whatsappUrl = "https://wa.me/14155238886?text=START";

  const businessTypes = [
    { icon: "👗", name: "Fashion", description: "Boutiques & Clothing" },
    { icon: "🍛", name: "Restaurant", description: "Food & Catering" },
    { icon: "💊", name: "Pharmacy", description: "Medical & Health" },
    { icon: "🎓", name: "School", description: "Education & Training" },
    { icon: "⛪", name: "Church", description: "Religious Organizations" },
    { icon: "💇", name: "Salon", description: "Beauty & Wellness" },
    { icon: "🛒", name: "Supermarket", description: "Retail & Shopping" },
    { icon: "📱", name: "Electronics", description: "Tech & Gadgets" }
  ];

  const stats = [
    { number: "1,247", label: "Nigerian businesses automated" },
    { number: "₦2.8M", label: "Monthly sales generated" },
    { number: "15,000", label: "Customer messages handled daily" },
    { number: "2 seconds", label: "Average response time" }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Customer Service",
      description: "Your AI responds instantly, even when you're sleeping"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "2-Second Response Time",
      description: "Faster than any human customer service agent"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Increase Sales by 40%",
      description: "Never miss a customer inquiry again"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Handle 100+ Customers",
      description: "Simultaneously, without breaking a sweat"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Business Runs Itself on{" "}
            <span className="text-primary">WhatsApp</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            AI responds to your customers in 2 seconds. Even when you're sleeping.
            Never miss a sale again.
          </p>

          {/* Social Proof */}
          <div className="mb-8">
            <p className="text-lg font-semibold text-primary mb-2">
              ⭐ 1,247 Nigerian businesses automated
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span>✓ Lagos • Abuja • Port Harcourt</span>
              <span>✓ All business types</span>
              <span>✓ 2G network optimized</span>
            </div>
          </div>

          {/* Main CTA */}
          <div className="mb-12">
            <a
              href={whatsappUrl}
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-xl font-semibold transition-colors mb-4 shadow-lg hover:shadow-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-6 h-6" />
              Start Free on WhatsApp
            </a>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                No WhatsApp? Text <strong>START</strong> to <strong>2347012345678</strong>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary" />
                  7 days free
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary" />
                  No credit card
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-primary" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Nigerian Business Owners Choose ODIA
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 rounded-lg border bg-card">
                <div className="text-primary flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Business Types Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Works for Any Business
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {businessTypes.map((type, index) => (
              <div key={index} className="text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="font-semibold text-sm mb-1">{type.name}</div>
                <div className="text-xs text-muted-foreground">{type.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Setup Takes 60 Seconds
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Click WhatsApp</h3>
              <p className="text-muted-foreground text-sm">
                No forms, no emails, no complicated signup process
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Answer 5 Questions</h3>
              <p className="text-muted-foreground text-sm">
                Business type, name, what you sell, delivery, hours
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Start Selling</h3>
              <p className="text-muted-foreground text-sm">
                Your AI agent is ready! Share with customers immediately
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <div className="text-5xl font-bold text-primary mb-2">₦20,000</div>
            <div className="text-muted-foreground mb-6">per month (that's only ₦667 per day)</div>
            
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="text-sm">
                <div className="font-semibold">Free Trial</div>
                <div className="text-muted-foreground">7 full days</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Payment</div>
                <div className="text-muted-foreground">Bank transfer or card</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold">Grace Period</div>
                <div className="text-muted-foreground">3 days if payment delayed</div>
              </div>
            </div>

            <a
              href={whatsappUrl}
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-6 h-6" />
              Try Free for 7 Days
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground border-t pt-8">
          <p className="mb-2">
            <strong>ODIA SmartBiz AI</strong> - Proudly Nigerian 🇳🇬
          </p>
          <p>
            Built for Nigerian infrastructure. Works on 2G networks. 
            Optimized for ₦20,000 Android phones.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
