import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import clearAnimation from "../assets/clear.json";
import cloudyAnimation from "../assets/cloudy.json";
import rainAnimation from "../assets/rain.json";
import snowAnimation from "../assets/snow.json";
import mistAnimation from "../assets/mist.json";
import { format } from "date-fns";

const API_KEY = "612b059d5ac97a871d91c58d4d09fc0e"; // Replace with your API key

export default function Weather() {
  const [city, setCity] = useState("New York");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [dateTime, setDateTime] = useState(new Date());

  // Fetch Weather Data
  const fetchWeather = async () => {
    if (!city) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError("City not found. Try again.");
        setWeather(null);
        return;
      }

      setWeather(data);
      setError("");
    } catch (error) {
      setError("Failed to fetch weather data.");
      setWeather(null);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Map Weather Condition to Animation
  const getAnimation = (condition) => {
    if (condition.includes("Clear")) return clearAnimation;
    if (condition.includes("Clouds")) return cloudyAnimation;
    if (condition.includes("Rain")) return rainAnimation;
    if (condition.includes("Snow")) return snowAnimation;
    if (condition.includes("Mist") || condition.includes("Fog")) return mistAnimation;
    return clearAnimation;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Weather App</h1>
      
      <p className="text-lg font-semibold text-gray-600">
        {format(dateTime, "EEEE, MMMM d, yyyy - hh:mm:ss a")}
      </p>

      <div className="flex gap-2 my-4">
        <input
          type="text"
          className="p-2 border rounded-lg outline-none w-60"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button 
          onClick={fetchWeather} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold">{weather.name}, {weather.sys.country}</h2>
          <p className="text-lg">{weather.weather[0].description}</p>

          <Lottie animationData={getAnimation(weather.weather[0].main)} className="w-40 mx-auto" />

          <p className="text-4xl font-bold">{weather.main.temp}°C</p>
          <p className="text-sm text-gray-600">
            Feels like: {weather.main.feels_like}°C | Humidity: {weather.main.humidity}%
          </p>
        </div>
      )}
    </div>
  );
}
