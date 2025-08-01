import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import MapSelector from "./components/MapSelector";
import "./styles/App.css";
import { fetchWeather, fetchForecast } from "./utils/api";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [theme, setTheme] = useState("dark");

  const handleLocationSelect = async ({ lat, lon }) => {
    try {
      const [weather, forecastData] = await Promise.all([
        fetchWeather(null, lat, lon),
        fetchForecast(null, lat, lon),
      ]);
      setWeatherData(weather);
      setForecast(forecastData);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Location not found");
      setWeatherData(null);
      setForecast(null);
    }
  };

  const handleCitySearch = async (city) => {
    try {
      const [weather, forecastData] = await Promise.all([
        fetchWeather(city),
        fetchForecast(city),
      ]);
      setWeatherData(weather);
      setForecast(forecastData);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("City not found");
      setWeatherData(null);
      setForecast(null);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await handleLocationSelect({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setErrorMsg("Unable to access location.");
        }
      );
    } else {
      setErrorMsg("Geolocation not supported.");
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="main-wrapper">
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="search-bar-container">
        <SearchBar onSearch={handleCitySearch} />
        <button className="location-btn" onClick={handleUseMyLocation}>
          📍 Use My Location
        </button>
      </div>

      <div className="content-panels">
        <div className="left-panel">
          {errorMsg ? (
            <div className="error-box">{errorMsg}</div>
          ) : (
            weatherData && <WeatherCard data={weatherData} forecast={forecast} />
          )}
        </div>
        <div className="right-panel">
          <MapSelector onLocationSelect={handleLocationSelect} />
        </div>
      </div>
    </div>
  );
}

export default App;
