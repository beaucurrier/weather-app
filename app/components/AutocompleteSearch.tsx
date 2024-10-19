'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cityList from '../../public/city.list.json'; // Import the city list

// Define the City interface to type the data
interface City {
  id: number;
  name: string;
  state?: string; // Optional state property
  country: string;
  coord: {
    lon: number;
    lat: number;
  };
}

// Cast the cityList as an array of City objects
const cities: City[] = cityList as City[];

export default function AutocompleteSearch() {
  const [city, setCity] = useState<string>(''); // State to store the user input
  const [suggestions, setSuggestions] = useState<City[]>([]); // State to store the city suggestions
  const [selectedCity, setSelectedCity] = useState<City | null>(null); // State to track the selected city
  const router = useRouter(); // Initialize the router for navigation

  // Function to fetch city suggestions based on user input
  const fetchCitySuggestions = (query: string) => {
    if (query.length < 3) return; // Only fetch when input is 3+ characters

    // Filter the city list to match the user's input
    const filteredCities = cities.filter((cityItem: City) =>
      cityItem.name.toLowerCase().startsWith(query.toLowerCase())
    );

    setSuggestions(filteredCities.slice(0, 5)); // Limit the suggestions to top 5
  };

  // Function to handle selecting a city from the suggestions
  const handleCitySelect = (city: City) => {
    setSelectedCity(city); // Save the selected city to state
    setSuggestions([]); // Hide the suggestions after selection
    router.push(`/location/${city.id}`); // Automatically navigate to /location/:cityId
  };

  // Function to navigate to the city's weather page using its city ID
  const goToCityWeather = () => {
    if (selectedCity) {
      router.push(`/location/${selectedCity.id}`); // Navigate to /location/:cityId
    } else {
      alert('Please select a city before viewing the weather'); // Alert if no city is selected
    }
  };

  return (
    <div>
      <div className='flex items-center space-x-4'>
        <input
          type='text'
          value={city} // Bind the input value to city state
          onChange={(e) => {
            setCity(e.target.value); // Update the city state with user input
            fetchCitySuggestions(e.target.value); // Fetch suggestions based on input
          }}
          placeholder='Enter a city...'
          className='p-2 border rounded-md text-gray-900'
        />
        <button
          className='p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
          onClick={goToCityWeather} // Navigate to the weather page for the selected city
        >
          View Weather
        </button>
      </div>

      {/* Display suggestions if available */}
      {suggestions.length > 0 && (
        <ul className='border mt-2'>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className='p-2 hover:bg-gray-200 cursor-pointer'
              onClick={() => handleCitySelect(suggestion)} // Automatically navigate on city selection
            >
              {suggestion.name}{suggestion.state ? `, ${suggestion.state}` : ''}, {suggestion.country} {/* Display city, state (if available), and country */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}