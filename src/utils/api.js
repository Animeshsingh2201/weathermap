import { API_KEY, BASE_URL } from "../config";

export const fetchWeather = async (city, lat = null, lon = null) => {
  let url = city
    ? `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    : `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error");
  return data;
};

export const fetchForecast = async (city, lat = null, lon = null) => {
  let url = city
    ? `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`
    : `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Forecast error");

  // Filter to get 1 forecast per day (at noon)
  const daily = [];
  const seen = new Set();

  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    const hour = entry.dt_txt.split(" ")[1];

    if (!seen.has(date) && hour === "12:00:00") {
      seen.add(date);
      daily.push({
        date,
        temp: entry.main.temp.toFixed(0),
        icon: entry.weather[0].icon,
        description: entry.weather[0].description,
      });
    }
  });

  return daily;
};
