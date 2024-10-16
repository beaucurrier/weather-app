'use client';
import { useState } from 'react';

export default function Home() {
  // State to store the city input and weather data
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data from the OpenWeather API
  const fetchWeather = async () => {
    setError(null); // Reset any previous error
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`);
      if (!response.ok) {
        throw new Error('City not found'); // Handle error when city is not found
      }
      const data = await response.json();
      setWeather(data); // Set the fetched weather data
    } catch (err: any) {
      setError(err.message); // Catch and set error if API request fails
    }
  };

  return (
    <div className="min-h-screen text-black flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8">Weather App</h1>
      <div className="mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city..."
          className="p-2 border rounded-md text-gray-900"
        />
        <button
          onClick={fetchWeather}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Get Weather
        </button>
      </div>

      {/* Display weather data or error message */}
      {error && <p className="text-red-500">{error}</p>}
      {weather && (
        <div className="mt-4">
          <h2 className="text-2xl">Weather in {weather.name}</h2>
          <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}