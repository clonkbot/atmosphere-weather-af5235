import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WeatherDisplay from './components/WeatherDisplay';
import SearchPanel from './components/SearchPanel';
import LocationInput from './components/LocationInput';
import ScanLines from './components/ScanLines';

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

const mockWeatherData: Record<string, WeatherData> = {
  'new york': {
    location: 'New York, NY',
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NW',
    pressure: 30.12,
    visibility: 10,
    uvIndex: 6,
    feelsLike: 74,
    hourlyForecast: [
      { time: '14:00', temp: 72, condition: 'cloudy' },
      { time: '15:00', temp: 73, condition: 'cloudy' },
      { time: '16:00', temp: 71, condition: 'sunny' },
      { time: '17:00', temp: 69, condition: 'sunny' },
      { time: '18:00', temp: 66, condition: 'clear' },
      { time: '19:00', temp: 63, condition: 'clear' },
    ],
  },
  'los angeles': {
    location: 'Los Angeles, CA',
    temperature: 84,
    condition: 'Sunny',
    humidity: 45,
    windSpeed: 8,
    windDirection: 'SW',
    pressure: 30.05,
    visibility: 12,
    uvIndex: 9,
    feelsLike: 86,
    hourlyForecast: [
      { time: '11:00', temp: 82, condition: 'sunny' },
      { time: '12:00', temp: 84, condition: 'sunny' },
      { time: '13:00', temp: 86, condition: 'sunny' },
      { time: '14:00', temp: 87, condition: 'sunny' },
      { time: '15:00', temp: 85, condition: 'sunny' },
      { time: '16:00', temp: 83, condition: 'sunny' },
    ],
  },
  'london': {
    location: 'London, UK',
    temperature: 58,
    condition: 'Rainy',
    humidity: 85,
    windSpeed: 15,
    windDirection: 'E',
    pressure: 29.85,
    visibility: 5,
    uvIndex: 2,
    feelsLike: 54,
    hourlyForecast: [
      { time: '19:00', temp: 58, condition: 'rainy' },
      { time: '20:00', temp: 56, condition: 'rainy' },
      { time: '21:00', temp: 55, condition: 'cloudy' },
      { time: '22:00', temp: 54, condition: 'cloudy' },
      { time: '23:00', temp: 53, condition: 'clear' },
      { time: '00:00', temp: 52, condition: 'clear' },
    ],
  },
  'tokyo': {
    location: 'Tokyo, Japan',
    temperature: 68,
    condition: 'Clear',
    humidity: 70,
    windSpeed: 5,
    windDirection: 'N',
    pressure: 30.20,
    visibility: 15,
    uvIndex: 4,
    feelsLike: 70,
    hourlyForecast: [
      { time: '03:00', temp: 65, condition: 'clear' },
      { time: '04:00', temp: 64, condition: 'clear' },
      { time: '05:00', temp: 63, condition: 'clear' },
      { time: '06:00', temp: 65, condition: 'sunny' },
      { time: '07:00', temp: 68, condition: 'sunny' },
      { time: '08:00', temp: 71, condition: 'sunny' },
    ],
  },
};

function App() {
  const [currentLocation, setCurrentLocation] = useState('new york');
  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData['new york']);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLocationChange = (location: string) => {
    const key = location.toLowerCase();
    if (mockWeatherData[key]) {
      setCurrentLocation(key);
      setWeatherData(mockWeatherData[key]);
    } else {
      // Generate random weather for unknown locations
      const randomTemp = Math.floor(Math.random() * 40) + 40;
      const conditions = ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Clear'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      setCurrentLocation(key);
      setWeatherData({
        location: location.charAt(0).toUpperCase() + location.slice(1),
        temperature: randomTemp,
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        pressure: 29.5 + Math.random() * 1.5,
        visibility: Math.floor(Math.random() * 10) + 5,
        uvIndex: Math.floor(Math.random() * 10) + 1,
        feelsLike: randomTemp + Math.floor(Math.random() * 6) - 3,
        hourlyForecast: Array.from({ length: 6 }, (_, i) => ({
          time: `${(new Date().getHours() + i) % 24}:00`,
          temp: randomTemp + Math.floor(Math.random() * 6) - 3,
          condition: ['sunny', 'cloudy', 'clear', 'rainy'][Math.floor(Math.random() * 4)],
        })),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#ff9f43] font-mono relative overflow-hidden">
      <ScanLines />

      {/* Atmospheric background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#1a1a2e]/50 via-transparent to-[#0a0a0f]" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#ff9f43]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#00ff88]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-b border-[#ff9f43]/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_10px_#00ff88]" />
            <h1 className="text-lg md:text-2xl tracking-[0.3em] uppercase font-bold">
              <span className="text-[#00ff88]">ATMO</span>
              <span className="text-[#ff9f43]">SPHERE</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-8 text-xs md:text-sm">
            <div className="flex flex-col items-end">
              <span className="text-[#ff9f43]/50 text-[10px] md:text-xs tracking-widest">SYSTEM TIME</span>
              <span className="text-[#00ff88] tabular-nums tracking-wider">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[#ff9f43]/50 text-[10px] md:text-xs tracking-widest">STATUS</span>
              <span className="text-[#00ff88] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col min-h-[calc(100vh-180px)]">
        <LocationInput
          onLocationChange={handleLocationChange}
          currentLocation={weatherData.location}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 flex-1">
          <div className="lg:col-span-2">
            <WeatherDisplay data={weatherData} />
          </div>

          <div className="lg:col-span-1">
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 md:p-6 border border-[#ff9f43]/30 bg-[#1a1a2e]/50 backdrop-blur-sm rounded-lg
                hover:border-[#00ff88]/50 hover:bg-[#1a1a2e]/70 transition-all duration-300 group mb-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#ff9f43]/50 flex items-center justify-center
                  group-hover:border-[#00ff88]/50 group-hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[10px] md:text-xs text-[#ff9f43]/50 tracking-widest">AI SEARCH</div>
                  <div className="text-sm md:text-base text-[#00ff88]">Ask anything about weather...</div>
                </div>
              </div>
            </motion.button>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { label: 'HUMIDITY', value: `${weatherData.humidity}%`, icon: '💧' },
                { label: 'WIND', value: `${weatherData.windSpeed} mph`, icon: '💨' },
                { label: 'PRESSURE', value: `${weatherData.pressure.toFixed(2)}"`, icon: '🔵' },
                { label: 'UV INDEX', value: weatherData.uvIndex.toString(), icon: '☀️' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-3 md:p-4 border border-[#ff9f43]/20 bg-[#1a1a2e]/30 rounded-lg"
                >
                  <div className="text-[10px] md:text-xs text-[#ff9f43]/50 tracking-widest mb-1">{stat.label}</div>
                  <div className="text-lg md:text-2xl text-[#00ff88] flex items-center gap-2">
                    <span>{stat.icon}</span>
                    <span>{stat.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#ff9f43]/20 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-[10px] md:text-xs text-[#ff9f43]/30 tracking-wider">
            Requested by @stringer_kade · Built by @clonkbot
          </p>
        </div>
      </footer>

      {/* Search Panel Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchPanel onClose={() => setIsSearchOpen(false)} weatherData={weatherData} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
