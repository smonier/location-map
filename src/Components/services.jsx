// services.jsx

import axios from 'axios';

const BASE_URL = 'https://us1.locationiq.com/v1';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchLocation = async () => {
    try {
        const { data } = await axios.get('https://ipapi.co/json/');
        return { city: data.city, lat: data.latitude, lon: data.longitude };
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
};

export const fetchCurrentWeather = async (apiKey, lat, lon) => {
    try {
        const { data } = await axios.get(`${WEATHER_BASE_URL}/weather`, {
            params: { lat, lon, units: 'metric', appid: apiKey },
        });
        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        throw error;
    }
};

export const fetchWeatherForecast = async (apiKey, lat, lon) => {
    try {
        const { data } = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
            params: { lat, lon, units: 'metric', appid: apiKey },
        });
        return data.list.filter((_, index) => index % 8 === 0); // 5-day forecast
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        throw error;
    }
};

export const fetchAddressFromCoordinates = async (apiKey, lat, lon) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching address from coordinates:', error);
        throw error;
    }
};

export const fetchCoordinatesFromAddress = async (apiKey, address) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`
        );
        return response.data[0];
    } catch (error) {
        console.error('Error fetching coordinates from address:', error);
        throw error;
    }
};

/**
 * Get the OpenWeatherMap icon URL based on icon code and size.
 * @param {string} iconCode - The code provided by OpenWeatherMap for the weather condition.
 * @param {string} size - Size of the icon: 'small' or 'big' (default: 'big').
 * @returns {string} - The complete URL for the weather icon.
 */
export const getWeatherIconUrl = (iconCode, size) => {
    const baseUrl = 'https://openweathermap.org/img/wn/';
    const iconSize = size === 'small' ? '.png' : '@2x.png';
    return `${baseUrl}${iconCode}${iconSize}`;
};