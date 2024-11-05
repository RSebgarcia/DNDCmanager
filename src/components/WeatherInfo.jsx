import React, { useEffect, useState } from 'react';
import './WeatherInfo.css'; // Asegúrate de crear este archivo CSS
import { Container,Row,Col } from 'react-bootstrap';

const WeatherInfo = ({ campaignId, timestamp, onUpdateWeather }) => {
    const [weather, setWeather] = useState({
        temperature: null,
        condition: null,
        minTemp: null,
        maxTemp: null,
        baseTemp: null,
    });
    const [lastUpdateDay, setLastUpdateDay] = useState(null);

    const calculateSeason = (date) => {
        const month = date.getMonth() + 1;
        if (month === 12 || month < 3) return 'Winter';
        if (month >= 3 && month < 6) return 'Spring';
        if (month >= 6 && month < 9) return 'Summer';
        return 'Autumn';
    };

    const getBaseTemperature = () => {
        const season = calculateSeason(new Date(timestamp));
        switch (season.toLowerCase()) {
            case 'Winter':
                return Math.floor(Math.random() * (11 - -5 + 1)) - 5; // -5 to 11
            case 'Summer':
                return Math.floor(Math.random() * (30 - 12 + 1)) + 12; // 12 to 30
            default:
                return Math.floor(Math.random() * (20 - 10 + 1)) + 10; // Spring/Autumn: 10 to 20
        }
    };

    const calculateWeatherCondition = (season) => {
        const conditions = {
            winter: ['Snowy', 'Cloudy', 'Foggy'],
            spring: ['Rainy', 'Cloudy', 'Sunny'],
            summer: ['Sunny', 'Cloudy', 'Rainy'],
            autumn: ['Cloudy', 'Foggy', 'Rainy'],
        };

        const possibleConditions = conditions[season.toLowerCase()]; // Convertir a minúsculas
    return possibleConditions[Math.floor(Math.random() * possibleConditions.length)];
    };

    const calculateDailyMinMaxTemps = (baseTemperature) => {
        const lowerLimit = Math.max(baseTemperature * 0.5, -10);
        const upperLimit = Math.max(baseTemperature * 1.33, lowerLimit + 2);
        return { minTemp: Math.round(lowerLimit), maxTemp: Math.round(upperLimit) };
    };

    const calculateTemperatureByTime = (minTemp, maxTemp, hour) => {
        const minHour = 4;
        const maxHour = 15;
        const midnightHour = 24;
        const nightMinPercentage = 0.7;

        if (hour < minHour) {
            return minTemp;
        } else if (hour >= minHour && hour < maxHour) {
            const percentage = (maxTemp - minTemp) * ((hour - minHour) / (maxHour - minHour)) + minTemp;
            return Math.round(percentage);
        } else if (hour >= maxHour && hour < midnightHour) {
            const percentage = maxTemp - (maxTemp - nightMinPercentage * maxTemp) * ((hour - maxHour) / (midnightHour - maxHour));
            return Math.round(percentage);
        } else {
            return Math.round(nightMinPercentage * maxTemp);
        }
    };

    useEffect(() => {
        if (!timestamp || new Date(timestamp).toString() === "Invalid Date") {
            console.error("Timestamp is undefined or invalid:", timestamp);
            return;
        }
    
        const currentDate = new Date(timestamp).toDateString();
        const previousDate = lastUpdateDay;
    
        if (currentDate !== previousDate) {
            const baseTemp = getBaseTemperature();
            const { minTemp, maxTemp } = calculateDailyMinMaxTemps(baseTemp);
            const season = calculateSeason(new Date(timestamp));
            const condition = calculateWeatherCondition(season);

            setWeather(prevWeather => ({
                ...prevWeather,
                baseTemp,
                minTemp,
                maxTemp,
                condition,
            }));
            setLastUpdateDay(currentDate);

            if (onUpdateWeather) {
                onUpdateWeather({ season, timestamp });
            }
        }
    }, [timestamp, onUpdateWeather]);

    useEffect(() => {
        if (weather.baseTemp !== null) {
            const currentHour = new Date(timestamp).getHours();
            const adjustedTemperature = calculateTemperatureByTime(weather.minTemp, weather.maxTemp, currentHour);
            if (adjustedTemperature !== weather.temperature) {
                setWeather(prevWeather => ({
                    ...prevWeather,
                    temperature: adjustedTemperature,
                }));
            }
        }
    }, [timestamp, weather.baseTemp]);

    return (
        <Container fluid  >
            <Row > {/* Espaciado inferior opcional */}
                <Col className="weather-details d-flex flex-row align-items-center ">
                    <div className='m-3' >
                        <h2 className="current-temperature fs-1">{weather.temperature !== null ? `${weather.temperature}°C` : 'Cargando...'}</h2>
                    </div>
                    <div>
                        <h4 className='m-0'>Mínima: {weather.minTemp !== null ? `${weather.minTemp}°C` : 'Calculando...'}</h4>
                        <h4 className='m-0' >Máxima: {weather.maxTemp !== null ? `${weather.maxTemp}°C` : 'Calculando...'}</h4>
                    </div>
                </Col>
                <Col className="weather-details ">
                    <h5 className="season-text text-center fs-3">Season: {calculateSeason(new Date(timestamp))}</h5>
                    <h5 className="weather-condition m-0 fs-4">State: {weather.condition || 'Cargando...'}</h5>
                </Col>
            </Row>
        </Container>
    );


}
export default WeatherInfo;
