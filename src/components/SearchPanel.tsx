import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  hourlyForecast: { time: string; temp: number; condition: string }[];
}

interface Props {
  onClose: () => void;
  weatherData: WeatherData;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Simulated AI responses based on weather context
const generateResponse = (query: string, weather: WeatherData): string => {
  const q = query.toLowerCase();

  if (q.includes('umbrella') || q.includes('rain')) {
    if (weather.condition.toLowerCase().includes('rain')) {
      return `Based on current conditions in ${weather.location}, YES - you should definitely bring an umbrella. The weather is currently ${weather.condition.toLowerCase()} with ${weather.humidity}% humidity. Rain is expected to continue in the coming hours.`;
    }
    return `Looking at ${weather.location}'s current conditions (${weather.condition}), you probably won't need an umbrella right now. However, always good to check the extended forecast before heading out!`;
  }

  if (q.includes('jacket') || q.includes('coat') || q.includes('cold')) {
    if (weather.temperature < 60) {
      return `At ${weather.temperature}°F in ${weather.location}, I'd recommend bringing a jacket. The feels-like temperature is ${weather.feelsLike}°F with winds at ${weather.windSpeed} mph from the ${weather.windDirection}. Better to have it and not need it!`;
    }
    return `With ${weather.temperature}°F in ${weather.location}, you should be comfortable without a heavy jacket. A light layer might be nice for ${weather.condition.toLowerCase()} conditions though.`;
  }

  if (q.includes('outdoor') || q.includes('outside') || q.includes('hike') || q.includes('walk')) {
    const uvWarning = weather.uvIndex > 6 ? `Note: UV index is ${weather.uvIndex}, so bring sunscreen!` : '';
    if (weather.condition.toLowerCase().includes('sunny') || weather.condition.toLowerCase().includes('clear')) {
      return `Great conditions for outdoor activities in ${weather.location}! ${weather.temperature}°F with ${weather.condition.toLowerCase()} skies. Visibility is excellent at ${weather.visibility} miles. ${uvWarning}`;
    }
    return `Conditions in ${weather.location} are ${weather.condition.toLowerCase()} at ${weather.temperature}°F. Visibility is ${weather.visibility} miles. You can still enjoy outdoor activities, but maybe have a backup plan. ${uvWarning}`;
  }

  if (q.includes('current') || q.includes('right now') || q.includes('weather')) {
    return `Current conditions in ${weather.location}: ${weather.temperature}°F (feels like ${weather.feelsLike}°F), ${weather.condition}. Humidity at ${weather.humidity}%, wind ${weather.windSpeed} mph ${weather.windDirection}. Barometric pressure: ${weather.pressure.toFixed(2)}". UV Index: ${weather.uvIndex}. Visibility: ${weather.visibility} miles.`;
  }

  if (q.includes('forecast') || q.includes('later') || q.includes('hour')) {
    const temps = weather.hourlyForecast.map(h => h.temp);
    const high = Math.max(...temps);
    const low = Math.min(...temps);
    return `6-hour forecast for ${weather.location}: Temperatures ranging from ${low}°F to ${high}°F. ${weather.hourlyForecast.map(h => `${h.time}: ${h.temp}°F (${h.condition})`).join(', ')}. Plan accordingly!`;
  }

  if (q.includes('uv') || q.includes('sun') || q.includes('sunscreen')) {
    const advice = weather.uvIndex <= 2 ? 'Low UV - minimal sun protection needed.' :
                   weather.uvIndex <= 5 ? 'Moderate UV - wear sunscreen if out for extended periods.' :
                   weather.uvIndex <= 7 ? 'High UV - sunscreen and hat recommended!' :
                   'Very High UV - limit midday sun exposure, use SPF 30+!';
    return `UV Index in ${weather.location}: ${weather.uvIndex}. ${advice}`;
  }

  // Default response
  return `I can help you understand the weather in ${weather.location}! Current conditions: ${weather.temperature}°F and ${weather.condition.toLowerCase()}. Try asking me about whether you need an umbrella, jacket recommendations, outdoor activity conditions, UV levels, or the hourly forecast.`;
};

export default function SearchPanel({ onClose, weatherData }: Props) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const userMessage = query.trim();
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const response = generateResponse(userMessage, weatherData);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  const suggestedQueries = [
    'Do I need an umbrella?',
    'Should I bring a jacket?',
    'Good for outdoor activities?',
    'What\'s the UV like?',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0f]/90 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl h-[80vh] md:h-[600px] border border-[#ff9f43]/30 bg-[#1a1a2e]/95 backdrop-blur-sm rounded-lg
          shadow-[0_0_50px_rgba(255,159,67,0.15)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-[#ff9f43]/20 flex items-center justify-between">
          <div>
            <h3 className="text-base md:text-lg text-[#00ff88] tracking-widest">AI WEATHER ASSISTANT</h3>
            <p className="text-[10px] md:text-xs text-[#ff9f43]/50 tracking-wider mt-1">POWERED BY PERPLEXITY API</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded border border-[#ff9f43]/30 flex items-center justify-center
              hover:border-[#ff9f43] hover:bg-[#ff9f43]/10 transition-all"
          >
            <svg className="w-5 h-5 text-[#ff9f43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl md:text-6xl mb-4 opacity-50">◎</div>
              <p className="text-[#ff9f43]/50 text-sm mb-6">Ask me anything about the weather...</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedQueries.map((sq) => (
                  <button
                    key={sq}
                    onClick={() => setQuery(sq)}
                    className="px-3 py-2 text-[10px] md:text-xs border border-[#ff9f43]/30 rounded
                      hover:border-[#00ff88] hover:text-[#00ff88] transition-all tracking-wider"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 md:p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[#ff9f43]/20 border border-[#ff9f43]/30 text-[#ff9f43]'
                    : 'bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88]'
                }`}
              >
                <p className="text-xs md:text-sm leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 p-3 md:p-4 rounded-lg">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-[#00ff88] rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t border-[#ff9f43]/20">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about weather..."
              className="flex-1 bg-[#0a0a0f]/50 border border-[#ff9f43]/30 rounded-lg px-4 py-3
                text-sm text-[#00ff88] placeholder-[#ff9f43]/30 focus:outline-none
                focus:border-[#00ff88] focus:shadow-[0_0_15px_rgba(0,255,136,0.2)] transition-all"
            />
            <button
              type="submit"
              disabled={isTyping || !query.trim()}
              className="px-4 md:px-6 py-3 bg-[#00ff88]/20 border border-[#00ff88]/50 rounded-lg
                text-[#00ff88] hover:bg-[#00ff88]/30 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="hidden md:inline text-sm tracking-wider">SEND</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
