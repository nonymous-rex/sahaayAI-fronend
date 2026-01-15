import { Cloud, Sun, Droplets, Wind } from "lucide-react";

export function WeatherWidget() {
  // Mock weather data - in production, fetch from weather API
  const weather = {
    temp: 24,
    condition: "Partly Cloudy",
    humidity: 65,
    wind: 12,
  };

  return (
    <div className="bg-gradient-nature p-5 rounded-2xl text-primary-foreground shadow-elevated">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-primary-foreground/80">Today's Weather</p>
          <p className="text-4xl font-display font-bold mt-1">{weather.temp}°C</p>
          <p className="text-sm mt-1 text-primary-foreground/90">{weather.condition}</p>
        </div>
        <div className="bg-primary-foreground/20 p-3 rounded-xl animate-float">
          <Sun className="w-8 h-8" />
          <Cloud className="w-6 h-6 -mt-3 ml-2" />
        </div>
      </div>
      
      <div className="flex gap-4 mt-4 pt-4 border-t border-primary-foreground/20">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          <span className="text-xs">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4" />
          <span className="text-xs">{weather.wind} km/h</span>
        </div>
      </div>
    </div>
  );
}
