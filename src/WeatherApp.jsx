import React, { useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { BiRefresh } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastCity, setLastCity] = useState("");
  const [isDarkMode, SetDarkMode] = useState(true); // 🌗 Theme toggle


  // weather api calling
  const apiKey = "72ecf11aa8b8f869f039485ba5967d97";

  const fetchWeather = async (cityName = city) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setWeather(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setLastCity(cityName);
    } catch (err) {
      setWeather(null);
      alert("City not found");
    } finally {
      setLoading(false);
    }
  };

  const handlingKeyPress = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  const handleRefresh = () => {
    if (lastCity) {
      fetchWeather(lastCity);
    }
  };
// setting the icon of different weather
  const getWeatherIcon = () => {
    const weatherMain = weather.weather[0].main.toLowerCase();
    switch (weatherMain) {
      case "clouds":
        return "/images/clouds.png";
      case "clear":
        return "/images/clear.png";
      case "drizzle":
        return "/images/drizzle.png";
      case "mist":
        return "/images/mist.png";
      case "rain":
        return "/images/rain.png";
      case "snow":
        return "/images/snow.png";
      default:
        return "/images/clear.png";
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-blue-700 via-cyan-500 to-teal-400"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
      }`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className={`rounded-3xl px-8 py-10 w-[400px] text-center shadow-2xl border ${
          isDarkMode
            ? "bg-white/20 text-white border-white/20 hover:shadow-blue-300"
            : "bg-gray-900 text-white border-gray-600 hover:shadow-gray-600"
        } transition-all duration-300 ease-in-out relative`}
      >
        {/* theme toggle button */}
        <button
          onClick={() => SetDarkMode(!isDarkMode)}
          className={`absolute top-3 right-3 text-sm px-2 py-1 rounded-full shadow-md transition-all duration-300 ${
            isDarkMode ? "bg-white/30 text-white" : "bg-white/20 text-white"
          }`}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

       {/* heading */}
        <h1 className="text-2xl font-semibold mb-4">Enter city name</h1>

     {/* search bar */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full mb-4 transition-all ${
            isDarkMode
              ? "bg-white/20 hover:ring-2 hover:ring-white/40"
              : "bg-gray-800 hover:ring-2 hover:ring-white/30"
          }`}
        >
          <input
            type="text"
            placeholder="Enter city....."
            className={`bg-transparent outline-none flex-1 text-lg ${
              isDarkMode
                ? "text-white placeholder-white"
                : "text-white placeholder-gray-300"
            }`}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handlingKeyPress}
          />
          <button
            onClick={() => fetchWeather()}
            className="hover:scale-110 transition-transform duration-200"
          >
            <FiSearch size={22} className="text-white" />
          </button>
        </div>

        {/* Refresh button  */}
        {lastCity && (
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-1 px-4 py-2 rounded-full mx-auto mb-6 hover:shadow-md transition-all ${
              isDarkMode ? "bg-white/20 text-white" : "bg-gray-800 text-white"
            }`}
          >
            <BiRefresh className="text-lg" />
            <span className="text-sm">Refresh {lastCity}</span>
          </motion.button>
        )}

        {/* loader div */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center my-8"
          >
            <div
              className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${
                isDarkMode ? "border-white" : "border-white"
              }`}
            />
          </motion.div>
        )}

        {/* weather data */}
        <AnimatePresence>
          {!loading && weather && (
            <motion.div
              key="weather-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img
                src={getWeatherIcon()}
                alt="weather icon"
                className="w-28 h-28 mx-auto mb-4"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(255,255,255,0.5)",
                }}
                transition={{ duration: 0.3 }}
              />
              <h1 className="text-5xl font-bold">
                {Math.round(weather.main.temp)}°C
              </h1>
              <h2 className="text-2xl font-medium mt-1">{weather.name}</h2>

              <div className="flex justify-around mt-6 text-center">
                {/* humidity */}
                <div className="flex flex-col items-center transition-all">
                  <img
                    src="/images/humidity.png"
                    alt="Humidity"
                    className="w-10 h-10 mb-2"
                  />
                  <p className="text-xl">{weather.main.humidity}%</p>
                  <p className="text-sm">Humidity</p>
                </div>

               {/* wind speed */}
                <div className="flex flex-col items-center transition-all">
                  <img
                    src="/images/wind.png"
                    alt="Wind Speed"
                    className="w-10 h-10 mb-2"
                  />
                  <p className="text-xl">{weather.wind.speed} km/h</p>
                  <p className="text-sm">Wind Speed</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
