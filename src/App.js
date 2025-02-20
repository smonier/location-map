import './App.css';
import { Container, Box } from '@mui/material';
import LocationMap from "./Components/LocationMap";

const App = () => (
    <Container
        maxWidth="lg"
        sx={{
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4, // Adds space between the components
            alignItems: 'center'
        }}
    >
        <Box sx={{ width: '100%', mb: 20 }}>
            <LocationMap
                initialLat={48.8566}
                initialLon={2.3522}
                locationIqApiKey={process.env.REACT_APP_LOCATIONIQ_API_KEY}
                weatherForecastApiKey={process.env.REACT_APP_WEATHER_API_KEY}
            />
        </Box>
    </Container>
);

export default App;