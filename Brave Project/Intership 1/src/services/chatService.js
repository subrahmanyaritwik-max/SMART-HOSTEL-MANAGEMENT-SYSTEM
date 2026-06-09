import axios from 'axios';

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

// Simulated responses to travel-related questions if the webhook URL is a placeholder or unavailable
const SIMULATED_RESPONSES = [
  {
    keywords: ['airport', 'pickup', 'drop', 'cab', 'taxi', 'transfer'],
    response: "Yes, Manivtha Tours & Travels provides premium 24/7 airport pickup and drop-off services. We have a fleet of clean, air-conditioned sedans, SUVs, and luxury coaches. You can book airport transfers directly as part of your tour package, or reserve a vehicle separately by calling our helpline. Our drivers track flight timings to ensure promptness."
  },
  {
    keywords: ['vehicle', 'car', 'suv', 'bus', 'tempo', 'coach', 'available', 'fleet'],
    response: "We offer a diverse fleet of well-maintained vehicles for all travel needs:\n\n1. **Sedans & Hatchbacks** (Toyota Etios, Maruti Dzire) - Ideal for couples or small families of up to 4.\n2. **Premium SUVs** (Toyota Innova Crysta, Mahindra XUV700) - Perfect for larger families (6-7 seats) with extra comfort.\n3. **Tempo Travelers** (12, 17, and 26-seater models) - Great for corporate groups and family outings.\n4. **Luxury Tour Coaches** (32, 40, and 50-seater Volvo buses) - Best for large tourist groups.\n\nAll vehicles come with professional, verified drivers experienced in tourist routes."
  },
  {
    keywords: ['book', 'tour', 'package', 'reserve', 'pay', 'payment', 'booking'],
    response: "Booking a tour package with Manivtha Tours & Travels is simple:\n\n1. **Submit Inquiry**: Share your destination and travel dates with us via this chatbot or our contact form.\n2. **Customized Itinerary**: Our travel consultants will email/WhatsApp you a day-by-day customized travel itinerary.\n3. **Confirmation**: Confirm your booking with a 20% advance payment via UPI, Bank Transfer, or Credit/Debit Card.\n\nRemaining payment can be settled on the day of arrival or mid-trip."
  },
  {
    keywords: ['price', 'cost', 'charge', 'rate', 'budget'],
    response: "Our pricing structure is transparent and varies by service:\n- **Sedan Rental**: Starts at ₹12 per km.\n- **SUV (Innova) Rental**: Starts at ₹18 per km.\n- **Tempo Traveler**: Starts at ₹26 per km.\n- **Customized Tour Packages**: Tailored packages start from ₹3,500 per person per day (includes sightseeing, accommodation, and private transfers). Tolls, state permits, and driver allowance are discussed transparently upfront."
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'evening'],
    response: "Hello! Welcome to Manivtha Tours & Travels support desk. I am your AI Travel Assistant. How can I help you plan your journey, choose a rental vehicle, or customize your tour package today?"
  },
  {
    keywords: ['contact', 'phone', 'call', 'number', 'email', 'support', 'help', 'address'],
    response: "You can reach Manivtha Tours & Travels through the following channels:\n- **Helpline / WhatsApp**: +91 98765 43210 (Available 24/7)\n- **Email**: support@manivthatravels.com\n- **Corporate Office**: 123, Travel Plaza, Main Road, Bengaluru, Karnataka, India\n- **Office Hours**: 9:00 AM to 8:00 PM (Monday to Saturday)"
  }
];

const getFallbackResponse = (question) => {
  const q = question.toLowerCase();
  for (const item of SIMULATED_RESPONSES) {
    if (item.keywords.some(keyword => q.includes(keyword))) {
      return item.response;
    }
  }
  return `Thank you for contacting Manivtha Tours & Travels support! I've received your question: "${question}". \n\nAs your AI chatbot, I can tell you we specialize in customized holiday tours, premium vehicle rentals (Sedans, Crysta, Tempo Travelers), and prompt airport pick-and-drop. For custom pricing or specific itineraries, please ask about our vehicle availability, airport services, or how to book a package, or contact our support directly at support@manivthatravels.com.`;
};

/**
 * Sends a question to the n8n chatbot workflow.
 * Falls back to simulation if the webhook is not configured or fails.
 * @param {string} question - The user's query.
 * @returns {Promise<Object>} An object containing the response string.
 */
export const sendMessage = async (question) => {
  if (!question || !question.trim()) {
    throw new Error('Question content cannot be empty.');
  }

  const isPlaceholder = !WEBHOOK_URL || WEBHOOK_URL.includes('your-n8n-url') || WEBHOOK_URL.trim() === '';

  if (isPlaceholder) {
    console.warn('VITE_N8N_WEBHOOK_URL is not configured. Returning simulated AI response.');
    // Artificial latency for a realistic loading feel
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      response: getFallbackResponse(question)
    };
  }

  try {
    const res = await axios.post(
      WEBHOOK_URL,
      { question: question.trim() },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000 // 15 seconds timeout
      }
    );

    let data = res.data;
    // n8n webhooks can return an array or object
    if (Array.isArray(data) && data.length > 0) {
      data = data[0];
    }

    if (data && typeof data === 'object') {
      if (data.response) {
        return { response: data.response };
      } else if (data.output) {
        return { response: data.output };
      } else if (data.text) {
        return { response: data.text };
      } else {
        return { response: JSON.stringify(data) };
      }
    } else if (typeof data === 'string') {
      return { response: data };
    } else {
      throw new Error('Invalid response format received from n8n webhook.');
    }
  } catch (error) {
    console.error('Error invoking n8n workflow:', error.message);
    
    // Attempt fallback with demo warning so the app continues working
    console.warn('Falling back to simulated travel chatbot response due to API connection failure.');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    return {
      response: `[Demo Mode - Webhook Offline] ${getFallbackResponse(question)}`
    };
  }
};
