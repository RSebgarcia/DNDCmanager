import React, { useEffect, useState } from 'react';

const DateTimeInfo = ({ startDate, campaignName, campaignId, onSaveTimestamp }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date(startDate));
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        // Cargar el último timestamp al iniciar el componente
        const lastTimestamp = localStorage.getItem(`campaign_${campaignId}_lastGameTimestamp`);
        if (lastTimestamp) {
            setCurrentDateTime(new Date(lastTimestamp));
        } else {
            setCurrentDateTime(new Date(startDate));
        }
    }, [startDate, campaignId]);

    useEffect(() => {
        let timer;
        if (isRunning) {
            // Avanzar el tiempo de fantasía en intervalos de 1000ms (1s real = 12s en fantasía)
            timer = setInterval(() => {
                setCurrentDateTime(prevDateTime => {
                    const newDateTime = new Date(prevDateTime.getTime() + 12000);
                    localStorage.setItem(`campaign_${campaignId}_lastGameTimestamp`, newDateTime.toISOString());
                    return newDateTime;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isRunning, campaignId]);

    const handleToggleTimer = () => {
        setIsRunning(prevState => {
            if (prevState) {
                onSaveTimestamp(currentDateTime); // Guardar cuando se pausa
            }
            return !prevState;
        });
    };

    return (
        <div>
            <h4>{campaignName}</h4>
            <p>Fecha actual en el mundo de fantasía: {currentDateTime.toLocaleString()}</p>
            <button onClick={handleToggleTimer}>
                {isRunning ? 'Pausar' : 'Reanudar'}
            </button>
        </div>
    );
};

export default DateTimeInfo;
