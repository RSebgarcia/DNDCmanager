import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './DateTimeInfo.css'; // Asegúrate de crear este archivo CSS

const DateTimeInfo = ({ startDate, campaignName, campaignId, onSaveTimestamp }) => {
    const [currentDateTime, setCurrentDateTime] = useState(() => {
        const lastTimestamp = localStorage.getItem(`campaign_${campaignId}_lastGameTimestamp`);
        return lastTimestamp ? new Date(lastTimestamp) : new Date(startDate);
    });
    const [isRunning, setIsRunning] = useState(false);
    const lastUpdateRef = useRef(new Date().getTime());
    const animationFrameId = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoursToSkip, setHoursToSkip] = useState(0);
    const [minutesToSkip, setMinutesToSkip] = useState(0);

    const fantasyTimeRatio = 12 * 1000 / 1000; // 12 Segundos en fantasía por segundo real
    const saveInterval = 30 * 60 * 1000; // 30 minutos en milisegundos
    const [lastSavedFantasyTime, setLastSavedFantasyTime] = useState(currentDateTime.getTime());

    const updateDateTime = () => {
        if (isRunning) {
            const now = new Date().getTime();
            const elapsedRealTime = now - lastUpdateRef.current;

            const elapsedFantasyTime = elapsedRealTime * fantasyTimeRatio;
            const newFantasyTime = new Date(currentDateTime.getTime() + elapsedFantasyTime);
            setCurrentDateTime(newFantasyTime);
            lastUpdateRef.current = now;

            if (newFantasyTime.getTime() - lastSavedFantasyTime >= saveInterval) {
                onSaveTimestamp(newFantasyTime);
                setLastSavedFantasyTime(newFantasyTime.getTime());
            }

            animationFrameId.current = requestAnimationFrame(updateDateTime);
        }
    };

    useEffect(() => {
        if (isRunning) {
            lastUpdateRef.current = new Date().getTime();
            animationFrameId.current = requestAnimationFrame(updateDateTime);
        } else {
            onSaveTimestamp(currentDateTime);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isRunning, currentDateTime]);

    const handleToggleTimer = () => {
        setIsRunning(prevState => !prevState);
    };

    const handleTimeSkip = () => {
        const totalMinutesToSkip = (hoursToSkip * 60) + minutesToSkip; // Convertir horas a minutos
        const newDate = new Date(currentDateTime.getTime() + totalMinutesToSkip * 60000);
        setCurrentDateTime(newDate);
        onSaveTimestamp(newDate);
        setIsModalOpen(false);
        setHoursToSkip(0);
        setMinutesToSkip(0);
        setIsRunning(true); // Reiniciar el contador
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setIsRunning(false); // Pausar la campaña al abrir el modal
    };
    return (
        <div className="clock-container d-flex flex-column align-items-center">
            <div className="clock d-flex flex-column align-items-center w-100">
                <div className="date-container text-center">
                    <span className="day">
                        {`Día ${currentDateTime.getDate()} del mes ${currentDateTime.getMonth() + 1}, año ${currentDateTime.getFullYear()}`}
                    </span>
                </div>
                <div className="time-container text-center">
                    <span className="time">
                        {currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                    <span className="time-of-day">
                        {currentDateTime.getHours() < 12 ? 'Mañana' : currentDateTime.getHours() < 18 ? 'Tarde' : 'Noche'}
                    </span>
                </div>
            </div>
            <div className="button-container d-flex justify-content-around mt-2">
                <button className="control-button" onClick={handleToggleTimer}>
                    {isRunning ? 'Pausar' : 'Reanudar'}
                </button>
                <button className="control-button" onClick={handleOpenModal}>Saltar Tiempo</button>
            </div>
        </div>
    );
    
    
} 
export default DateTimeInfo;
