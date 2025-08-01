const WeatherCard = ({ data, forecast }) => {
  if (!data) return null; // <-- Prevents crash if data is undefined

  const { name, main, weather, wind } = data;

  return (
    <div className="weather-card">
      <h2>{name}</h2>
      <p>Temperature: {main?.temp}°C</p>
      <p>Feels like: {main?.feels_like}°C</p>
      <p>Humidity: {main?.humidity}%</p>
      <p>Weather: {weather[0]?.description}</p>
      <p>Wind Speed: {wind?.speed} m/s</p>

      {forecast && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{day.date}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                />
                <p>{day.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
