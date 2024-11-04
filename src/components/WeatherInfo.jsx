import React, { useEffect, useState } from 'react';

const WeatherInfo = ({ campaignId }) => {
    const [weather, setWeather] = useState({ temperature: null, condition: null });
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        // Cargar el clima inicial desde localStorage
        const savedWeather = JSON.parse(localStorage.getItem(`campaign_${campaignId}_weather`));
        if (savedWeather) {
            setWeather(savedWeather);
            setLastUpdate(new Date(savedWeather.lastUpdate));
        }
    }, [campaignId]);
    
    useEffect(() => {
        const now = new Date();
        const hoursSinceLastUpdate = (now - lastUpdate) / (1000 * 60 * 60);
        
        if (hoursSinceLastUpdate >= 3) {
            const newTemperature = Math.floor(Math.random() * (35 - 15 + 1)) + 15;
            const conditions = ["Sunny", "Rainy", "Cloudy", "Foggy"];
            const newCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
            const updatedWeather = { temperature: newTemperature, condition: newCondition, lastUpdate: now };
            setWeather(updatedWeather);
            setLastUpdate(now);
    
            // Guardar en localStorage
            localStorage.setItem(`campaign_${campaignId}_weather`, JSON.stringify(updatedWeather));
        }
    }, [lastUpdate, campaignId]);
    return (
        <div className="weather-info">
            <h4>Temperature: {weather.temperature}°C</h4>
            <h5>Condition: {weather.condition}</h5>
        </div>
    );
};

export default WeatherInfo;
