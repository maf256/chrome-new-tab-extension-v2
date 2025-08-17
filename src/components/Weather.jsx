import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Cloud, Sun, CloudRain, CloudSnow, Zap } from "lucide-react";

export default function Weather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sandvika coordinates (approximate)
  const lat = 59.8939;
  const lon = 10.5226;

  const getWeatherIcon = (symbolCode) => {
    const iconProps = { size: 20, className: "inline-block ml-1" };

    if (symbolCode.includes("clearsky") || symbolCode.includes("fair")) {
      return (
        <Sun {...iconProps} className="inline-block ml-1 text-yellow-500" />
      );
    } else if (
      symbolCode.includes("partlycloudy") ||
      symbolCode.includes("cloudy")
    ) {
      return (
        <Cloud {...iconProps} className="inline-block ml-1 text-gray-500" />
      );
    } else if (
      symbolCode.includes("rain") ||
      symbolCode.includes("lightrain") ||
      symbolCode.includes("heavyrain")
    ) {
      return (
        <CloudRain {...iconProps} className="inline-block ml-1 text-blue-500" />
      );
    } else if (symbolCode.includes("snow")) {
      return (
        <CloudSnow {...iconProps} className="inline-block ml-1 text-blue-200" />
      );
    } else if (symbolCode.includes("thunder")) {
      return (
        <Zap {...iconProps} className="inline-block ml-1 text-purple-500" />
      );
    }
    return <Cloud {...iconProps} className="inline-block ml-1 text-gray-400" />;
  };

  const getWeatherStatus = (symbolCode) => {
    if (symbolCode.includes("clearsky")) return "Clear";
    if (symbolCode.includes("fair")) return "Fair";
    if (symbolCode.includes("partlycloudy")) return "Partly Cloudy";
    if (symbolCode.includes("cloudy")) return "Cloudy";
    if (symbolCode.includes("lightrain")) return "Light Rain";
    if (symbolCode.includes("rain")) return "Rain";
    if (symbolCode.includes("heavyrain")) return "Heavy Rain";
    if (symbolCode.includes("lightsnow")) return "Light Snow";
    if (symbolCode.includes("snow")) return "Snow";
    if (symbolCode.includes("thunder")) return "Thunder";
    return "Unknown";
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);

        // Yr.no API endpoint for location forecast
        const response = await fetch(
          `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
          {
            headers: {
              "User-Agent": "WeatherApp/1.0 (https://example.com/contact)",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Get current time and next 5 hours
        const now = new Date();
        const next5Hours = [];

        for (let i = 0; i < 6; i++) {
          const time = new Date(now.getTime() + i * 60 * 60 * 1000);
          next5Hours.push(time.toISOString());
        }

        // Process the forecast data
        const processedData = next5Hours.map((timeString, index) => {
          const time = new Date(timeString);

          // Find the closest forecast entry
          const forecastEntry =
            data.properties.timeseries.find((entry) => {
              const entryTime = new Date(entry.time);
              return Math.abs(entryTime - time) < 30 * 60 * 1000; // Within 30 minutes
            }) || data.properties.timeseries[0];

          const instant = forecastEntry.data.instant.details;
          const next1h = forecastEntry.data.next_1_hours;

          return {
            time: time.getHours() + ":00",
            fullTime: timeString,
            temperature: Math.round(instant.air_temperature),
            status: next1h
              ? getWeatherStatus(next1h.summary.symbol_code)
              : "Unknown",
            symbolCode: next1h ? next1h.summary.symbol_code : "unknown",
            humidity: Math.round(instant.relative_humidity),
            windSpeed: Math.round(instant.wind_speed * 3.6), // Convert m/s to km/h
          };
        });

        setWeatherData(processedData);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`Time: ${label}`}</p>
          <p className="text-blue-600">{`Temperature: ${data.temperature}°C`}</p>
          <p className="flex items-center">
            Status: {data.status}
            {getWeatherIcon(data.symbolCode)}
          </p>
          <p className="text-sm text-gray-500">{`Humidity: ${data.humidity}%`}</p>
          <p className="text-sm text-gray-500">{`Wind: ${data.windSpeed} km/h`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather data for Sandvika...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
        <div className="text-center text-red-600">
          <p className="font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">

      {/* Weather Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {weatherData.map((item, index) => (
          <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="font-semibold text-gray-700">{item.time}</p>
            <div className="flex items-center justify-center my-2">
              <span className="text-2xl font-bold text-blue-600">
                {item.temperature}°
              </span>
              {getWeatherIcon(item.symbolCode)}
            </div>
            <p className="text-xs text-gray-600">{item.status}</p>
          </div>
        ))}
      </div>

      {/* Temperature Chart */}
      <div className="h-55 ">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={weatherData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
