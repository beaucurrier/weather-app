/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function Home() {
  // State to store the city input, weather data, lat/lon, and error message
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch latitude and longitude for a given city
  const fetchGeoCoordinates = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon }; // return lat and lon
      } else {
        throw new Error("City not found");
      }
    } catch (error) {
      throw setError("Failed to fetch coordinates");
    }
  };

  // Fetch weather data from the OpenWeather API using lat/lon
  const fetchWeather = async () => {
    setError(null); // Reset any previous error
    try {
      // Fetch lat and lon first
      const { lat, lon } = await fetchGeoCoordinates();

      // Fetch weather data using the obtained lat/lon
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Weather data not found");
      }

      const data = await response.json();
      console.log(data);
      setWeather(data); // Set the fetched weather data
    } catch (err: any) {
      setError(err.message); // Catch and set error if API request fails
    }
  };

  return (
    <div className='min-h-screen text-black flex flex-col items-center justify-center bg-gray-100 p-6'>
      <h1 className='text-4xl font-bold mb-8'>Weather App</h1>
      <div className='mb-4'>
        <input
          type='text'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder='Enter a city...'
          className='p-2 border rounded-md text-gray-900'
        />
        <button
          onClick={fetchWeather}
          className='ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
        >
          Get Weather
        </button>
      </div>

      {/* Display weather data or error message */}
      {error && <p className='text-red-500'>{error}</p>}
      {weather && (
        <div className='mt-4'>
          <h2 className='text-2xl'>Weather at ({city})</h2>
          <p>
            Temperature: {((weather.current.temp * 9) / 5 - 459.67).toFixed(2)}{" "}
            °F
          </p>
          <p>Weather: {weather.current.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}