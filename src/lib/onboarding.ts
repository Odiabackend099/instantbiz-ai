// Onboarding flow logic for WhatsApp
import { 
  ONBOARDING_STEPS, 
  BUSINESS_CATEGORIES, 
  BUSINESS_TYPE_NAMES, 
  BUSINESS_HOURS_OPTIONS,
  type OnboardingState 
} from './types';

export interface OnboardingResponse {
  message: string;
  isComplete: boolean;
  nextStep?: number;
  businessData?: {
    type: string;
    name: string;
    category: string;
    hasDelivery: boolean;
    hours: string;
  };
}

export class OnboardingManager {
  static processMessage(
    currentState: OnboardingState | null,
    userInput: string,
    phone: string
  ): OnboardingResponse {
    
    // Initialize new onboarding if no state exists
    if (!currentState) {
      return {
        message: ONBOARDING_STEPS[0].question,
        isComplete: false,
        nextStep: 1
      };
    }

    const { current_step } = currentState;
    const input = userInput.trim().toUpperCase();

    // Validate current step input
    const currentStepData = ONBOARDING_STEPS[current_step - 1];
    if (!currentStepData.validation!(userInput)) {
      return {
        message: `❌ Invalid input. ${currentStepData.question}`,
        isComplete: false,
        nextStep: current_step
      };
    }

    // Process each step
    switch (current_step) {
      case 1: // Business Type
        const businessTypeKey = input;
        const businessTypeName = BUSINESS_TYPE_NAMES[businessTypeKey];
        
        if (!businessTypeName) {
          return {
            message: "❌ Please select a number from 1-10.\n\n" + ONBOARDING_STEPS[0].question,
            isComplete: false,
            nextStep: 1
          };
        }

        const categories = BUSINESS_CATEGORIES[businessTypeKey];
        const step2Question = ONBOARDING_STEPS[1].question
          .replace('[BUSINESS_TYPE]', businessTypeName);

        return {
          message: step2Question,
          isComplete: false,
          nextStep: 2
        };

      case 2: // Business Name
        const businessName = userInput.trim();
        const step3Question = this.buildStep3Question(currentState.business_type!, businessName);
        
        return {
          message: step3Question,
          isComplete: false,
          nextStep: 3
        };

      case 3: // Product Category
        const categoryIndex = ['A', 'B', 'C', 'D', 'E'].indexOf(input);
        const categories3 = BUSINESS_CATEGORIES[currentState.business_type!];
        const selectedCategory = categoryIndex === 4 ? 'Everything/Mixed' : categories3[categoryIndex];
        
        const step4Question = ONBOARDING_STEPS[3].question
          .replace('[PRODUCT_CATEGORY]', selectedCategory);

        return {
          message: step4Question,
          isComplete: false,
          nextStep: 4
        };

      case 4: // Delivery
        const hasDelivery = input === 'Y';
        const step5Question = ONBOARDING_STEPS[4].question;

        return {
          message: step5Question,
          isComplete: false,
          nextStep: 5
        };

      case 5: // Business Hours
        const hoursKey = input;
        const hours = BUSINESS_HOURS_OPTIONS[hoursKey];
        
        if (!hours) {
          return {
            message: "❌ Please select 1, 2, 3, or 4.\n\n" + ONBOARDING_STEPS[4].question,
            isComplete: false,
            nextStep: 5
          };
        }

        // Generate completion message
        const completionMessage = this.generateCompletionMessage(currentState, hours);
        
        return {
          message: completionMessage,
          isComplete: true,
          businessData: {
            type: currentState.business_type!,
            name: currentState.business_name!,
            category: currentState.product_category!,
            hasDelivery: currentState.has_delivery!,
            hours: hours
          }
        };

      default:
        return {
          message: "❌ Something went wrong. Let's start over.\n\n" + ONBOARDING_STEPS[0].question,
          isComplete: false,
          nextStep: 1
        };
    }
  }

  private static buildStep3Question(businessType: string, businessName: string): string {
    const categories = BUSINESS_CATEGORIES[businessType];
    const baseQuestion = ONBOARDING_STEPS[2].question
      .replace('[BUSINESS_NAME]', businessName);

    if (!categories) return baseQuestion;

    return baseQuestion
      .replace('[CATEGORY_A]', categories[0] || 'Option A')
      .replace('[CATEGORY_B]', categories[1] || 'Option B')
      .replace('[CATEGORY_C]', categories[2] || 'Option C')
      .replace('[CATEGORY_D]', categories[3] || 'Option D');
  }

  private static generateCompletionMessage(state: OnboardingState, hours: string): string {
    const businessTypeName = BUSINESS_TYPE_NAMES[state.business_type!];
    const deliveryText = state.has_delivery ? 'Available' : 'Pickup only';
    
    // Generate AI assistant name based on business type
    const aiNames: Record<string, string> = {
      "1": "Lexi", // Fashion
      "2": "Chef", // Restaurant
      "3": "Doc", // Pharmacy
      "4": "Teach", // School
      "5": "Pastor", // Church
      "6": "Style", // Salon
      "7": "Shop", // Supermarket
      "8": "Tech", // Electronics
      "9": "Estate", // Real Estate
      "10": "Swift" // Logistics
    };

    const aiName = aiNames[state.business_type!] || "Lexi";
    const phone = "07012345678"; // This would be dynamically generated

    return `🚀 DONE! Your AI Assistant '${aiName}' is ready!

✅ Business: ${state.business_name}
✅ Type: ${businessTypeName}
✅ Category: ${state.product_category}
✅ Hours: ${hours}
✅ Delivery: ${deliveryText}

Your customers can now message this number!
📱 ${phone}

Try it - send 'Hi' to test ${aiName}

Your 7-day FREE trial starts now
After trial: ₦20,000/month

Commands:
PAUSE - Pause ${aiName}
RESUME - Resume ${aiName}
STATS - See today's statistics
HELP - Get support

Ready to share with customers? Send your first test message!`;
  }

  static getProgressMessage(step: number): string {
    const totalSteps = ONBOARDING_STEPS.length;
    const progress = Math.round((step / totalSteps) * 100);
    return `📊 Setup Progress: ${progress}% (${step}/${totalSteps})`;
  }

  static isAdminCommand(message: string): boolean {
    const adminCommands = ['PAUSE', 'RESUME', 'STATS', 'HELP', 'STATUS'];
    return adminCommands.includes(message.toUpperCase().trim());
  }

  static processAdminCommand(command: string, businessData?: any): string {
    const cmd = command.toUpperCase().trim();
    
    switch (cmd) {
      case 'PAUSE':
        return "⏸️ AI Assistant paused.\n\nCustomers will receive: 'We're temporarily unavailable. We'll respond soon!'\n\nSend RESUME to reactivate.";
      
      case 'RESUME':
        return "▶️ AI Assistant resumed!\n\nYour AI is now responding to customers again.\n\nSend STATS to see recent activity.";
      
      case 'STATS':
        return `📊 TODAY'S STATS:\n\n✉️ Messages: 23\n👥 Customers: 8\n⏱️ Avg response: 1.9s\n💰 Orders: 3 (₦15,000)\n\nMost asked: "What do you have?"\n\nAI is active ✅`;
      
      case 'HELP':
        return `🆘 HELP & SUPPORT:\n\n📞 Call: 2348012345678\n💬 WhatsApp: 2348012345678\n📧 Email: help@odia.dev\n\nCommands:\nPAUSE - Stop AI responses\nRESUME - Start AI responses\nSTATS - View daily statistics\n\nNeed human support? Just ask!`;
      
      case 'STATUS':
        return `📋 ACCOUNT STATUS:\n\n🎯 Plan: 7-day FREE trial\n📅 Trial ends: 5 days left\n💳 Payment: Not required yet\n🤖 AI Status: Active\n\n24/7 customer service running!`;
      
      default:
        return "❌ Unknown command.\n\nAvailable commands:\nPAUSE, RESUME, STATS, HELP, STATUS\n\nOr just ask for help!";
    }
  }
}