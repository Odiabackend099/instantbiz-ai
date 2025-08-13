// Core types for ODIA SmartBiz AI
export interface Business {
  id: string;
  phone: string;
  name: string;
  type: string;
  status: 'trial' | 'active' | 'paused' | 'expired';
  trial_ends_at: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingState {
  id: string;
  phone: string;
  current_step: number;
  business_type?: string;
  business_name?: string;
  product_category?: string;
  has_delivery?: boolean;
  business_hours?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageQueue {
  id: string;
  phone: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  retry_count: number;
  created_at: string;
  processed_at?: string;
}

export interface ResponseCache {
  business_type: string;
  question_hash: string;
  response: string;
  created_at: string;
}

export interface Payment {
  id: string;
  business_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  tx_ref?: string;
  payment_method?: string;
  created_at: string;
  completed_at?: string;
}

export interface Analytics {
  id: string;
  business_id: string;
  date: string;
  messages_handled: number;
  customers_served: number;
  orders_taken: number;
  avg_response_time_ms: number;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// WhatsApp webhook types
export interface WhatsAppMessage {
  from: string;
  to: string;
  body: string;
  timestamp: string;
  message_id: string;
}

// Onboarding flow steps
export interface OnboardingStep {
  step: number;
  question: string;
  options?: Array<{
    key: string;
    text: string;
    value: string;
  }>;
  validation?: (input: string) => boolean;
}

// Business onboarding questions
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    step: 1,
    question: "Welcome to ODIA SmartBiz! 🎉\n\nI'll create your AI assistant in 60 seconds.\n\nWhat type of business do you run?\n\n1️⃣ Fashion/Boutique\n2️⃣ Restaurant/Food\n3️⃣ Pharmacy\n4️⃣ School\n5️⃣ Church\n6️⃣ Salon/Beauty\n7️⃣ Supermarket\n8️⃣ Electronics\n9️⃣ Real Estate\n🔟 Logistics\n\nReply with a number (1-10)",
    validation: (input: string) => /^([1-9]|10)$/.test(input.trim())
  },
  {
    step: 2,
    question: "Great choice! [BUSINESS_TYPE]\n\nWhat's your business name?\n\nExample: \"Mama Nkechi Boutique\" or \"Lagos Food Palace\"",
    validation: (input: string) => input.trim().length >= 2 && input.trim().length <= 50
  },
  {
    step: 3,
    question: "Nice name! [BUSINESS_NAME]\n\nWhat do you mainly sell/offer?\n\nA. [CATEGORY_A]\nB. [CATEGORY_B]\nC. [CATEGORY_C]\nD. [CATEGORY_D]\nE. Everything/Mixed\n\nReply with letter (A-E)",
    validation: (input: string) => /^[A-E]$/i.test(input.trim())
  },
  {
    step: 4,
    question: "Perfect! [PRODUCT_CATEGORY]\n\nDo you offer delivery?\n\nY - Yes, we deliver\nN - No, pickup only\n\nReply Y or N",
    validation: (input: string) => /^[YN]$/i.test(input.trim())
  },
  {
    step: 5,
    question: "Last question!\n\nWhat are your business hours?\n\n1. 8am - 6pm\n2. 9am - 8pm\n3. 10am - 10pm\n4. 24/7 online\n\nReply with number (1-4)",
    validation: (input: string) => /^[1-4]$/.test(input.trim())
  }
];

// Business categories by type
export const BUSINESS_CATEGORIES: Record<string, string[]> = {
  "1": ["Women's clothing", "Men's clothing", "Children's clothing", "Shoes & Bags"],
  "2": ["Nigerian dishes", "Continental food", "Fast food", "Drinks & snacks"],
  "3": ["Prescription drugs", "Over-counter meds", "Health supplements", "Medical supplies"],
  "4": ["Primary education", "Secondary education", "Vocational training", "Online courses"],
  "5": ["Religious services", "Events & weddings", "Counseling", "Community programs"],
  "6": ["Hair styling", "Makeup & beauty", "Nail services", "Spa treatments"],
  "7": ["Groceries", "Electronics", "Household items", "Personal care"],
  "8": ["Phones & tablets", "Computers", "Accessories", "Repairs"],
  "9": ["Property sales", "Rentals", "Land", "Commercial spaces"],
  "10": ["Package delivery", "Moving services", "Courier", "Freight"]
};

export const BUSINESS_TYPE_NAMES: Record<string, string> = {
  "1": "Fashion/Boutique",
  "2": "Restaurant/Food",
  "3": "Pharmacy",
  "4": "School",
  "5": "Church",
  "6": "Salon/Beauty",
  "7": "Supermarket",
  "8": "Electronics",
  "9": "Real Estate",
  "10": "Logistics"
};

export const BUSINESS_HOURS_OPTIONS: Record<string, string> = {
  "1": "8am - 6pm",
  "2": "9am - 8pm", 
  "3": "10am - 10pm",
  "4": "24/7 online"
};