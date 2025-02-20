import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {fetchAddressFromCoordinates, fetchCoordinatesFromAddress} from './services';
import {TextField, Button, Box, Card} from '@mui/material';
import WeatherForecastApp from './WeatherForecastApp';

// Fix the default marker icon issue with Leaflet in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const RecenterMap = ({position}) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom(), {animate: true});
        }
    }, [position, map]);
    return null;
};

const LocationMarker = ({setLatLon, setAddress, locationIqApiKey}) => {
    useMapEvents({
        click: async (e) => {
            const {lat, lng} = e.latlng;
            setLatLon({lat, lon: lng});
            try {
                const data = await fetchAddressFromCoordinates(locationIqApiKey, lat, lng);
                setAddress(data.display_name);
            } catch {
                setAddress('Address could not be resolved.');
            }
        }
    });
    return null;
};

const LocationMap = ({initialLat, initialLon, locationIqApiKey, weatherForecastApiKey}) => {
    const [latLon, setLatLon] = useState({lat: initialLat, lon: initialLon});
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [searchAddress, setSearchAddress] = useState('');
    const [markerPosition, setMarkerPosition] = useState([initialLat, initialLon]);

    const handleAddressSearch = async () => {
        if (searchAddress.trim() !== '') {
            try {
                const result = await fetchCoordinatesFromAddress(locationIqApiKey, searchAddress);
                const {lat, lon, display_name} = result;
                const position = [parseFloat(lat), parseFloat(lon)];
                setLatLon({lat: parseFloat(lat), lon: parseFloat(lon)});
                setMarkerPosition(position);
                setAddress(display_name);
            } catch {
                setAddress('Location not found.');
            }
        }
    };

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const data = await fetchAddressFromCoordinates(locationIqApiKey, latLon.lat, latLon.lon);
                setAddress(data.display_name);
                setCity((data.address.city ? data.address.city : data.address.town ? data.address.town : data.address.village) + ', ' + data.address.country)
                setMarkerPosition([latLon.lat, latLon.lon]);
            } catch {
                setAddress('Address could not be resolved.');
            }
        };
        fetchAddress();
    }, [latLon, locationIqApiKey]);

    return (
        <Card
            sx={{

                borderRadius: 4,
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
            }}
        >
        <Box sx={{ width: '100%', position: 'relative', mb: 10}}>
            <Box sx={{position: 'absolute', top: 10, right: 10, zIndex: 1000, display: 'flex', gap: 1}}>
                <TextField
                    variant="outlined"
                    size="small"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    placeholder="Enter address"
                    sx={{backgroundColor: 'white', borderRadius: 1}}
                />
                <Button variant="contained" color="primary" onClick={handleAddressSearch}>
                    Locate
                </Button>
            </Box>
            <MapContainer center={markerPosition} zoom={13} scrollWheelZoom={true}
                          style={{height: '60vh', width: '100%'}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <RecenterMap position={markerPosition}/>
                <LocationMarker setLatLon={setLatLon} setAddress={setAddress} locationIqApiKey={locationIqApiKey}/>
                <Marker position={markerPosition}>
                    <Popup>
                        <strong>Address:</strong><br/>
                        {address}
                    </Popup>
                </Marker>
            </MapContainer>

            <Box sx={{padding: '10px', backgroundColor: '#f9f9f9'}}>
                <h3>Selected Location Details</h3>
                <p><strong>Latitude:</strong> {latLon.lat}</p>
                <p><strong>Longitude:</strong> {latLon.lon}</p>
                <p><strong>Address:</strong> {address}</p>
            </Box>
            <Box>
                <WeatherForecastApp
                    weatherForecastApiKey={weatherForecastApiKey}
                    lat={latLon.lat}
                    lon={latLon.lon}
                    city={city}
                />
            </Box>
        </Box>
        </Card>
    );
};

export default LocationMap;

/**
 * Usage Example:
 * <LocationMap initialLat={48.8566} initialLon={2.3522} locationIqApiKey={"YOUR_LOCATIONIQ_API_KEY"} weatherForecastApiKey={"YOUR_WEATHER_API_KEY"} />
 */
