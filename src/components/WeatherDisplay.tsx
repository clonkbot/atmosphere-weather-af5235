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
  data: WeatherData;
}

const getConditionIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes('sun') || c.includes('clear')) return '◉';
  if (c.includes('cloud') || c.includes('partly')) return '◎';
  if (c.includes('rain')) return '◈';
  if (c.includes('snow')) return '❋';
  if (c.includes('storm')) return '⚡';
  return '◉';
};

export default function WeatherDisplay({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      {/* Main temperature display */}
      <div className="border border-[#ff9f43]/30 bg-[#1a1a2e]/50 backdrop-blur-sm rounded-lg p-4 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 md:gap-0">
          <div>
            <motion.div
              key={data.location}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] md:text-xs text-[#ff9f43]/50 tracking-[0.3em] mb-2"
            >
              CURRENT LOCATION
            </motion.div>
            <motion.h2
              key={`loc-${data.location}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-3xl text-[#00ff88] tracking-wider mb-4 text-center md:text-left"
            >
              {data.location.toUpperCase()}
            </motion.h2>
            <motion.div
              key={`cond-${data.condition}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 text-[#ff9f43] text-center md:text-left justify-center md:justify-start"
            >
              <span className="text-2xl md:text-4xl">{getConditionIcon(data.condition)}</span>
              <span className="text-base md:text-xl tracking-widest">{data.condition.toUpperCase()}</span>
            </motion.div>
          </div>

          <motion.div
            key={`temp-${data.temperature}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="text-center"
          >
            <div className="text-7xl md:text-9xl font-bold text-[#00ff88] leading-none tracking-tighter"
              style={{ textShadow: '0 0 30px rgba(0, 255, 136, 0.5)' }}>
              {data.temperature}
              <span className="text-3xl md:text-5xl text-[#ff9f43] align-top">°F</span>
            </div>
            <div className="text-[10px] md:text-xs text-[#ff9f43]/50 tracking-widest mt-2">
              FEELS LIKE {data.feelsLike}°F
            </div>
          </motion.div>
        </div>

        {/* Data readout bars */}
        <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'WIND', value: `${data.windSpeed} ${data.windDirection}`, percent: data.windSpeed * 4 },
            { label: 'HUMIDITY', value: `${data.humidity}%`, percent: data.humidity },
            { label: 'VISIBILITY', value: `${data.visibility} mi`, percent: data.visibility * 6 },
            { label: 'UV INDEX', value: data.uvIndex.toString(), percent: data.uvIndex * 10 },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="text-[10px] md:text-xs text-[#ff9f43]/50 tracking-widest mb-1">{item.label}</div>
              <div className="text-sm md:text-lg text-[#00ff88] mb-2">{item.value}</div>
              <div className="h-1 bg-[#ff9f43]/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(item.percent, 100)}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-[#ff9f43] to-[#00ff88]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hourly forecast */}
      <div className="border border-[#ff9f43]/30 bg-[#1a1a2e]/50 backdrop-blur-sm rounded-lg p-4 md:p-6">
        <div className="text-[10px] md:text-xs text-[#ff9f43]/50 tracking-[0.3em] mb-4">HOURLY FORECAST</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {data.hourlyForecast.map((hour, index) => (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}
              className="text-center p-2 md:p-3 border border-[#ff9f43]/10 rounded bg-[#0a0a0f]/50
                hover:border-[#00ff88]/30 hover:bg-[#1a1a2e]/50 transition-all"
            >
              <div className="text-[10px] md:text-xs text-[#ff9f43]/50 mb-1">{hour.time}</div>
              <div className="text-lg md:text-2xl mb-1">{getConditionIcon(hour.condition)}</div>
              <div className="text-sm md:text-lg text-[#00ff88]">{hour.temp}°</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
