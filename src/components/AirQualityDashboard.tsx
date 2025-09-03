import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data for demonstration
const mockCities = [
  {
    city: "Jakarta",
    country: "Indonesia",
    aqi: 95,
    temperature: 28,
    humidity: 75,
    weather: "Partly Cloudy",
    pm25: 35,
    history: [85, 88, 92, 89, 95, 97, 93, 91, 95, 98, 96, 95]
  },
  {
    city: "Bangkok",
    country: "Thailand", 
    aqi: 142,
    temperature: 32,
    humidity: 68,
    weather: "Sunny",
    pm25: 55,
    history: [145, 148, 142, 139, 142, 144, 140, 138, 142, 146, 143, 142]
  },
  {
    city: "Singapore",
    country: "Singapore",
    aqi: 38,
    temperature: 29,
    humidity: 82,
    weather: "Light Rain",
    pm25: 15,
    history: [42, 40, 38, 35, 38, 41, 39, 37, 38, 40, 39, 38]
  }
];

interface AirQualityData {
  city: string;
  country: string;
  aqi: number;
  temperature: number;
  humidity: number;
  weather: string;
  pm25: number;
  history: number[];
}

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { status: 'Good', className: 'aqi-good' };
  if (aqi <= 100) return { status: 'Moderate', className: 'aqi-moderate' };
  if (aqi <= 150) return { status: 'Unhealthy for Sensitive', className: 'aqi-unhealthy-sensitive' };
  if (aqi <= 200) return { status: 'Unhealthy', className: 'aqi-unhealthy' };
  if (aqi <= 300) return { status: 'Very Unhealthy', className: 'aqi-very-unhealthy' };
  return { status: 'Hazardous', className: 'aqi-hazardous' };
};

const getWeatherIcon = (weather: string) => {
  if (weather.includes('Sunny')) return Sun;
  if (weather.includes('Rain')) return CloudRain;
  if (weather.includes('Cloud')) return Cloud;
  return Sun;
};

const AirQualityCard: React.FC<{ data: AirQualityData; index: number }> = ({ data, index }) => {
  const aqiStatus = getAQIStatus(data.aqi);
  const WeatherIcon = getWeatherIcon(data.weather);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="bg-gradient-card shadow-md hover:shadow-lg transition-all duration-300 border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {data.city}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{data.country}</p>
            </div>
            <WeatherIcon className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* AQI Display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">
              {data.aqi}
            </div>
            <Badge variant="secondary" className={`${aqiStatus.className} font-medium px-3 py-1`}>
              {aqiStatus.status}
            </Badge>
          </div>

          {/* Mini Chart */}
          <div className="h-12 flex items-end justify-between gap-1">
            {data.history.map((value, i) => (
              <div
                key={i}
                className="bg-primary/30 rounded-sm transition-all duration-300 hover:bg-primary/50"
                style={{ height: `${(value / Math.max(...data.history)) * 100}%`, minHeight: '4px' }}
              />
            ))}
          </div>

          {/* Weather Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-primary" />
              <span>{data.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" />
              <span>{data.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Wind className="h-4 w-4 text-primary" />
              <span>PM2.5: {data.pm25} μg/m³</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AirQualityDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState<AirQualityData[]>(mockCities);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with the IQAir API
    console.log('Searching for:', searchQuery);
    // For demo purposes, we'll just add a mock city
    if (searchQuery.trim()) {
      const newCity: AirQualityData = {
        city: searchQuery,
        country: "Demo Country",
        aqi: Math.floor(Math.random() * 200) + 20,
        temperature: Math.floor(Math.random() * 15) + 20,
        humidity: Math.floor(Math.random() * 30) + 50,
        weather: "Partly Cloudy",
        pm25: Math.floor(Math.random() * 50) + 10,
        history: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 20)
      };
      setCities([newCity, ...cities]);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Air Quality Dashboard
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="border-primary/20 hover:bg-primary/5"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-lg text-muted-foreground">
            Realtime air quality & weather data
          </p>
        </motion.header>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto mb-8"
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter city name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-primary/20 focus:border-primary/40"
              />
            </div>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              Search
            </Button>
          </form>
        </motion.div>

        {/* Grid of Air Quality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <AirQualityCard key={`${city.city}-${city.country}`} data={city} index={index} />
          ))}
        </div>

        {/* API Notice */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 p-4 bg-card/50 rounded-lg border border-primary/10"
        >
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This is a demo using mock data. To use real data, integrate with the{' '}
            <a href="https://api.airvisual.com" className="text-primary hover:underline">
              IQAir AirVisual API
            </a>{' '}
            by adding your API key.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AirQualityDashboard;