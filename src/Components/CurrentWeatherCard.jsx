import React from 'react';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CompressIcon from '@mui/icons-material/Compress';
import { getWeatherIconUrl } from './services';

const formatDateTime = (timestamp, timezone) => {
    return new Date((timestamp + timezone) * 1000).toLocaleString(navigator.language, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const CurrentWeatherCard = ({ currentWeather, city }) => {
    const {
        main: { temp, feels_like, humidity, pressure },
        weather,
        wind: { speed, deg },
        visibility,
        dt,
        timezone,
        sys: { country },
    } = currentWeather;

    return (
        <Card sx={{ mb: 3, padding: '1.5rem' }}>
            <CardContent>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" gutterBottom>
                            <AccessTimeIcon sx={{ mr: 1 }} />
                            {formatDateTime(dt, timezone)}
                        </Typography>
                        <Typography variant="h6">
                            <LocationOnIcon sx={{ mr: 1 }} />
                            {city}, {country}
                        </Typography>
                        <Typography
                            variant="h3"
                            color="primary"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2, // Adjust the gap between the image and temperature
                            }}
                        >
                            <img
                                src={getWeatherIconUrl(currentWeather.weather[0].icon, 'big')}
                                alt={currentWeather.weather[0].description}
                                style={{ width: 80, height: 80 }}
                            />
                            {temp.toFixed(1)}°C
                        </Typography>
                        <Typography variant="body1">
                            Feels like {feels_like.toFixed(1)}°C. {weather[0].description}.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Typography><AirIcon /> Wind: {speed} m/s ({deg}°)</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><CompressIcon /> Pressure: {pressure} hPa</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><OpacityIcon /> Humidity: {humidity}%</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><VisibilityIcon /> Visibility: {(visibility / 1000).toFixed(1)} km</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><WbSunnyIcon /> UV Index: 0</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography><DeviceThermostatIcon /> Dew Point: {temp.toFixed(1)}°C</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default CurrentWeatherCard;