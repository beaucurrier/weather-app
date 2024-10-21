'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// Define interfaces for weather and forecast data
interface WeatherData {
  name: string;
  weather: [{ description: string; icon: string }];
  main: { temp: number; temp_min: number; temp_max: number };
  sys: { country: string; sunrise: number; sunset: number };
}

interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: { all: number };
    wind: { speed: number; deg: number; gust: number };
    visibility: number;
    pop: number;
    rain?: { '3h': number };
    sys: { pod: string };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function CityWeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { cityId } = useParams();

  // Fetch weather data for the city
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data: WeatherData = await response.json();
        setWeather(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchWeatherData();
  }, [cityId]);

  // Fetch the 12-hour forecast
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Failed to fetch forecast data');
        const data: ForecastData = await response.json();
        setForecast(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchForecastData();
  }, [cityId]);

  const convertToFahrenheit = (temp: number) => (temp * 9) / 5 + 32;

  if (error) {
    return <p className='text-red-500'>Error: {error}</p>;
  }

  if (!weather || !forecast) {
    return <p>Loading weather data...</p>;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white'>
      {/* Back button */}
      <a href='/' className='text-left w-full mb-4 text-white'>
        &larr; Home
      </a>

      {/* Weather Display Section */}
      <div className='w-full max-w-md bg-blue-600 p-6 rounded-lg shadow-md flex items-center justify-between text-white'>
        <div>
          <h1 className='text-4xl font-bold'>
            {weather.name} ({weather.sys.country})
          </h1>
          <p className='text-xl'>
            Current Temperature {convertToFahrenheit(weather.main.temp).toFixed(1)}°F
          </p>
          <p className='text-4xl font-bold'>
            {convertToFahrenheit(weather.main.temp_max).toFixed(1)}°F
          </p>
          <p className='text-2xl'>
            {convertToFahrenheit(weather.main.temp_min).toFixed(1)}°F
          </p>
          <p className='mt-2'>
            Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p>
            Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
          </p>
        </div>
        <div className='flex flex-col items-center'>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} className='w-16 h-16' />
          <p>{weather.weather[0].description}</p>
        </div>
      </div>

      {/* 12-Hour Forecast Section */}
      <h2 className='text-2xl font-bold mt-8'>12 Hour Forecast</h2>
      <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-6 lg:grid-cols-6'>
        {forecast.list.slice(0, 12).map((item, index) => (
          <div key={index} className='bg-blue-600 p-4 rounded-lg shadow-md flex flex-col items-center'>
            <p className='font-bold'>
              {index === 0 ? 'NOW' : new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} className='w-12 h-12' />
            <p>{convertToFahrenheit(item.main.temp).toFixed(1)}°F</p>
          </div>
        ))}
      </div>
    </div>
  );
}