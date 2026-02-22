import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onLocationChange: (location: string) => void;
  currentLocation: string;
}

const quickLocations = ['New York', 'Los Angeles', 'London', 'Tokyo'];

export default function LocationInput({ onLocationChange, currentLocation }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLocationChange(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className={`border ${isFocused ? 'border-[#00ff88]' : 'border-[#ff9f43]/30'}
          bg-[#1a1a2e]/50 backdrop-blur-sm rounded-lg transition-all duration-300
          ${isFocused ? 'shadow-[0_0_20px_rgba(0,255,136,0.2)]' : ''}`}>
          <div className="flex items-center">
            <div className="pl-4 md:pl-6 py-3 md:py-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#ff9f43]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="ENTER LOCATION COORDINATES..."
              className="flex-1 bg-transparent px-3 md:px-4 py-3 md:py-4 text-sm md:text-base text-[#00ff88] placeholder-[#ff9f43]/30
                focus:outline-none tracking-wider"
            />
            <button
              type="submit"
              className="px-4 md:px-6 py-3 md:py-4 text-[#ff9f43] hover:text-[#00ff88] transition-colors
                border-l border-[#ff9f43]/20 hover:bg-[#ff9f43]/10"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Quick location buttons */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        <span className="text-[10px] md:text-xs text-[#ff9f43]/50 tracking-widest self-center mr-2">QUICK ACCESS:</span>
        {quickLocations.map((loc, index) => (
          <motion.button
            key={loc}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            onClick={() => onLocationChange(loc)}
            className={`px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs tracking-widest border rounded transition-all duration-200
              ${currentLocation.toLowerCase() === loc.toLowerCase()
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                : 'border-[#ff9f43]/30 text-[#ff9f43]/70 hover:border-[#ff9f43] hover:text-[#ff9f43]'
              }`}
          >
            {loc.toUpperCase()}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
