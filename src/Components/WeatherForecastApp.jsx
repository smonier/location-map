import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, CircularProgress, Box } from '@mui/material';
import { fetchCurrentWeather, fetchWeatherForecast, getWeatherIconUrl } from './services';
import CurrentWeatherCard from './CurrentWeatherCard';


const formatDate = (dateString, locale = navigator.language) => {
    return new Date(dateString).toLocaleDateString(locale, {
        weekday: 'short', // Short weekday name (e.g., Thu)
        month: 'short',   // Short month name (e.g., Feb)
        day: 'numeric'    // Numeric day (e.g., 25)
    });
};

const WeatherForecastApp = ({ weatherForecastApiKey, lat, lon, city }) => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [current, forecastData] = await Promise.all([
                    fetchCurrentWeather(weatherForecastApiKey, lat, lon),
                    fetchWeatherForecast(weatherForecastApiKey, lat, lon)
                ]);
                setCurrentWeather(current);
                setForecast(forecastData);
            } catch (error) {
                console.error('Error loading weather data:', error);
                setError('Failed to load weather data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchWeatherData();
    }, [weatherForecastApiKey, lat, lon]);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;

    if (error) return (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
            {error}
        </Typography>
    );

    return (

        <Box>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Weather Forecast for {city}
                </Typography>
                <CurrentWeatherCard
                    currentWeather={currentWeather}
                    city={city}
                />

                <Typography variant="h5" gutterBottom>
                    5-Day Forecast
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {forecast.map((day, index) => (
                        <Grid item xs={12} sm={2.4} key={index}> {/* Adjusted for 5 items in one row */}
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '1rem',
                                    height: '100%',
                                    textAlign: 'center',
                                }}
                            >
                                <img
                                    src={getWeatherIconUrl(day.weather[0].icon,'small')}
                                    alt={day.weather[0].description}
                                   // style={{ width: 80, height: 80 }}
                                />
                                <CardContent>
                                    <Typography variant="subtitle1">
                                        {formatDate(day.dt_txt)}
                                    </Typography>
                                    <Typography>Temp: {day.main.temp}°C</Typography>
                                    <Typography>{day.weather[0].description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default WeatherForecastApp;
