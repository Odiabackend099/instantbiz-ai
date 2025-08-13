// Pre-built Nigerian business templates with cached responses
export interface BusinessTemplate {
  type: string;
  name: string;
  commonQuestions: Array<{
    question: string;
    responses: string[];
  }>;
  defaultResponses: {
    greeting: string;
    hours: string;
    delivery: string;
    pricing: string;
    orders: string;
  };
}

export const businessTemplates: Record<string, BusinessTemplate> = {
  "1": {
    type: "fashion",
    name: "Fashion/Boutique",
    commonQuestions: [
      {
        question: "what do you have|what you sell|show me|catalogue",
        responses: [
          "We have beautiful women's clothing:\n\nDRESSES\n- Ankara dresses: ₦8,000 - ₦15,000\n- Office wears: ₦12,000 - ₦25,000\n- Casual gowns: ₦6,000 - ₦12,000\n\nTOPS & BLOUSES\n- Shirts: ₦4,000 - ₦8,000\n- Blouses: ₦5,000 - ₦10,000\n\nWould you like to see pictures or know about sizes?",
          "Our latest collection includes:\n\n👗 DRESSES (₦6,000 - ₦25,000)\n👚 TOPS & BLOUSES (₦4,000 - ₦10,000)\n👖 TROUSERS & SKIRTS (₦5,000 - ₦12,000)\n👠 SHOES & ACCESSORIES (₦3,000 - ₦8,000)\n\nWhat style are you looking for?"
        ]
      },
      {
        question: "size|fit|measurement",
        responses: [
          "We have sizes:\n\nSMALL (UK 8-10)\nMEDIUM (UK 12-14)\nLARGE (UK 16-18)\nXL (UK 20-22)\nXXL (UK 24-26)\n\nSend your measurements for perfect fit:\n- Bust: __ inches\n- Waist: __ inches\n- Hip: __ inches\n\nWhat size do you need?",
          "Available sizes: S, M, L, XL, XXL\n\nFor perfect fit, please share:\n📏 Your measurements\n👗 Preferred style (fitted/loose)\n\nWhich item interests you?"
        ]
      },
      {
        question: "price|how much|cost",
        responses: [
          "Our prices are very affordable:\n\n💰 BUDGET RANGE (₦3,000 - ₦8,000)\n💎 PREMIUM RANGE (₦8,000 - ₦25,000)\n\nBulk purchases get 10% discount (5+ items)\nPayment: Cash, Transfer, POS\n\nWhat's your budget range?",
          "Prices vary by style:\n\nCasual wear: ₦3,000 - ₦8,000\nOffice wear: ₦8,000 - ₦15,000\nParty wear: ₦12,000 - ₦25,000\n\nSpecial offer: Buy 3, get 1 free!\nWhich category interests you?"
        ]
      }
    ],
    defaultResponses: {
      greeting: "Welcome to [BUSINESS_NAME]! 👗\n\nWe sell beautiful women's clothing:\n- Latest fashion trends\n- Quality fabrics\n- Affordable prices\n- All sizes available\n\nHow can I help you today?",
      hours: "We're open [BUSINESS_HOURS] Monday to Saturday.\n\nSunday: Closed\n\nFor urgent orders, WhatsApp anytime!",
      delivery: "🚚 DELIVERY OPTIONS:\n\n✅ Lagos delivery: ₦1,000 (same day)\n✅ Other states: ₦2,500 (2-3 days)\n✅ Pickup available at our store\n\nFREE delivery for orders above ₦20,000!",
      pricing: "Our prices are fixed and very competitive.\n\nBut we offer:\n💰 Bulk discounts (5+ items)\n💰 Student discounts (with ID)\n💰 Return customer discounts\n\nPayment on delivery available!",
      orders: "To place your order:\n\n1️⃣ Tell me what you want\n2️⃣ Confirm your size\n3️⃣ Share delivery address\n4️⃣ Choose payment method\n\nI'll confirm total cost and delivery time!"
    }
  },
  "2": {
    type: "restaurant",
    name: "Restaurant/Food",
    commonQuestions: [
      {
        question: "menu|food|what do you serve",
        responses: [
          "🍽️ OUR MENU:\n\nRICE DISHES (₦800 - ₦2,500)\n- Jollof rice & chicken\n- Fried rice with fish\n- Coconut rice special\n\nSOUPS & SWALLOW (₦1,500 - ₦3,000)\n- Egusi, Okra, Bitter leaf\n- Fufu, Semo, Pounded yam\n\nGRILLS & PEPPERED (₦2,000 - ₦5,000)\n- Peppered chicken/fish\n- Suya, Asun, Croaker\n\nWhat would you like to order?"
        ]
      },
      {
        question: "price|cost|how much",
        responses: [
          "💰 PRICE LIST:\n\n🍚 RICE DISHES: ₦800 - ₦2,500\n🍲 SOUPS: ₦1,500 - ₦3,000\n🍖 GRILLS: ₦2,000 - ₦5,000\n🥤 DRINKS: ₦200 - ₦500\n\nCombo deals available!\nMinimum order: ₦1,000\n\nWhat can I get you?"
        ]
      }
    ],
    defaultResponses: {
      greeting: "Welcome to [BUSINESS_NAME]! 🍽️\n\nFresh, delicious Nigerian meals:\n- Rice dishes\n- Soups & swallow\n- Grilled specialties\n- Fast delivery\n\nWhat would you like to eat today?",
      hours: "⏰ OPENING HOURS:\n[BUSINESS_HOURS] Daily\n\n🚚 Delivery until 10pm\n📞 Call for late orders",
      delivery: "🚚 DELIVERY:\n\n✅ Within 5km: ₦500\n✅ 5-10km: ₦1,000\n✅ Above 10km: ₦1,500\n\nFREE delivery for orders ₦5,000+\nDelivery time: 30-45 minutes",
      pricing: "All prices are fixed.\n\nSpecial offers:\n🎉 Buy 2 get 1 free (drinks)\n🎉 Family pack discounts\n🎉 Bulk order discounts\n\nPayment: Cash, transfer, POS",
      orders: "To order:\n\n1️⃣ Choose your meal\n2️⃣ Add drinks/extras\n3️⃣ Confirm delivery address\n4️⃣ Choose payment method\n\nTotal cost and delivery time will be confirmed!"
    }
  },
  "3": {
    type: "pharmacy",
    name: "Pharmacy",
    commonQuestions: [
      {
        question: "medicine|drug|medication",
        responses: [
          "💊 WE HAVE:\n\nPRESCRIPTION DRUGS\n- All antibiotics\n- Blood pressure meds\n- Diabetes medication\n- Pain relievers\n\nOVER-THE-COUNTER\n- Vitamins & supplements\n- First aid supplies\n- Baby products\n- Personal care\n\nWhat do you need? Send prescription if required."
        ]
      }
    ],
    defaultResponses: {
      greeting: "Welcome to [BUSINESS_NAME] Pharmacy! 💊\n\nWe provide:\n- Prescription medications\n- Over-counter drugs\n- Health consultations\n- Fast delivery\n\nHow can I help with your health needs?",
      hours: "⏰ PHARMACY HOURS:\n[BUSINESS_HOURS]\n\n🚨 Emergency? Call us directly\n💊 Prescription orders anytime",
      delivery: "🚚 MEDICINE DELIVERY:\n\n✅ Same area: ₦300\n✅ Nearby areas: ₦500\n✅ Emergency delivery: ₦1,000\n\nFREE delivery for orders ₦3,000+",
      pricing: "Medicine prices are regulated.\n\nWe offer:\n💰 Generic alternatives\n💰 Senior citizen discounts\n💰 Bulk purchase discounts\n\nInsurance accepted!",
      orders: "To order medicine:\n\n1️⃣ Send prescription (if needed)\n2️⃣ Confirm medication details\n3️⃣ Share delivery address\n4️⃣ Choose payment method\n\nPharmacist will verify before delivery!"
    }
  }
};

export const getBusinessTemplate = (businessType: string): BusinessTemplate | null => {
  return businessTemplates[businessType] || null;
};

export const generateResponse = (
  businessTemplate: BusinessTemplate,
  userMessage: string,
  businessData: {
    name: string;
    hours: string;
    hasDelivery: boolean;
  }
): string | null => {
  const message = userMessage.toLowerCase();
  
  // Check for specific questions first
  for (const qna of businessTemplate.commonQuestions) {
    const pattern = new RegExp(qna.question, 'i');
    if (pattern.test(message)) {
      // Return random response from available responses
      const responses = qna.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Check for greeting patterns
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(message)) {
    return businessTemplate.defaultResponses.greeting.replace('[BUSINESS_NAME]', businessData.name);
  }

  // Check for hours inquiry
  if (/hours|time|open|close|when/.test(message)) {
    return businessTemplate.defaultResponses.hours
      .replace('[BUSINESS_HOURS]', businessData.hours);
  }

  // Check for delivery inquiry
  if (/deliver|shipping|send|location/.test(message)) {
    return businessData.hasDelivery 
      ? businessTemplate.defaultResponses.delivery
      : "Sorry, we don't offer delivery. Pickup only at our location.";
  }

  // Check for pricing inquiry
  if (/price|cost|money|pay|cheap|expensive/.test(message)) {
    return businessTemplate.defaultResponses.pricing;
  }

  // Check for order inquiry
  if (/order|buy|purchase|want|need/.test(message)) {
    return businessTemplate.defaultResponses.orders;
  }

  return null; // No cached response found, will use OpenAI
};