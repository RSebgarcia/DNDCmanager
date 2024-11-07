import './CampaignPage.css';
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Container, Row, Col, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import WeatherInfo from '../components/WeatherInfo';
import DateTimeInfo from '../components/DateTimeInfo';
import DBHandler from '../components/DBHandler';
import DiceSet from '../components/DiceSet';
import EnemySelector from '../components/EnemySelector'; // Importar el nuevo componente
import Battleground from '../components/Battleground';

const CampaignPage = () => {
    const [campaign, setCampaign] = useState(null);
    const [campaignId, setCampaignId] = useState(null);
    const { campaigns, saveCampaignsToLocalStorage } = DBHandler();
    const [fantasyTimestamp, setFantasyTimestamp] = useState(new Date());
    const [enemies, setEnemies] = useState([]); // Estado para los enemigos
    
    useEffect(() => {
        const loadedCampaign = JSON.parse(localStorage.getItem('currentCampaign'));
        if (loadedCampaign) {
            setCampaign(loadedCampaign);
            setCampaignId(loadedCampaign.id);
            const lastGameTimestamp = localStorage.getItem(`campaign_${loadedCampaign.id}_lastGameTimestamp`);

            if (lastGameTimestamp) {
                const timestamp = new Date(lastGameTimestamp);
                if (!isNaN(timestamp.getTime())) {
                    setFantasyTimestamp(timestamp);
                } else {
                    console.error("Timestamp inválido en localStorage:", lastGameTimestamp);
                    const startTimestamp = new Date(loadedCampaign.startDate);
                    setFantasyTimestamp(startTimestamp);
                }
            } else {
                const startTimestamp = new Date(loadedCampaign.startDate);
                setFantasyTimestamp(startTimestamp);
            }
        }
    }, [campaigns]);

    const handleSaveTimestamp = useCallback((timestamp) => {
        if (!campaignId) return;

        const isValidDate = timestamp instanceof Date && !isNaN(timestamp.getTime());

        if (!isValidDate) {
            console.error("Timestamp inválido:", timestamp);
            return;
        }

        localStorage.setItem(`campaign_${campaignId}_lastGameTimestamp`, timestamp.toISOString());

        const currentCampaign = JSON.parse(localStorage.getItem('currentCampaign'));
        if (currentCampaign) {
            currentCampaign.lastGameTimestamp = timestamp.toISOString();
            localStorage.setItem('currentCampaign', JSON.stringify(currentCampaign));
            saveCampaignsToLocalStorage(campaigns);
        }
    }, [campaignId, campaigns, saveCampaignsToLocalStorage]);

    const startDate = campaign ? new Date(campaign.startDate) : null;

    const campaignName = campaign ? campaign.name : '';

    console.log('Timestamp en Page', fantasyTimestamp);

    const handleAddEnemy = (enemy) => {
        setEnemies((prevEnemies) => [...prevEnemies, enemy]); // Agregar enemigo a la lista
    };
    
    return (
        <Container fluid className="ps-5 pe-5 campaign-page vw-100 vh-100 bg-dark">
            {/*Header*/}
            <Stack gap={3} className='bg-secondary rounded'>
                <Row className='align-items-center'>
                    <Col>
                        {/* Aquí puedes agregar un logo o título si es necesario */}
                    </Col>
                </Row>
                <Row className='align-items-center'>
                    <Col className='mb-4' md={{span: 7, offset: 1}}>
                        {campaign && (
                            <WeatherInfo
                                campaignId={campaignId}
                                timestamp={fantasyTimestamp}
                                className="info-card"
                            />
                        )}
                    </Col>
                    <Col className='mb-4'>
                        {campaign && campaignId !== null && (
                            <DateTimeInfo
                                startDate={startDate}
                                campaignName={campaignName}
                                campaignId={campaignId}
                                onSaveTimestamp={handleSaveTimestamp}
                                className="info-card"
                            />
                        )}
                    </Col>
                </Row>
            </Stack>
            <Row className="campaign-info game-container">
                {/*Info de campaña, panel izquierdo*/}
                <Col md={3} className='me-2 mx-2 p-4 mt-3 bg-secondary rounded'>
                    <h1 className='text-center mt-2'>{campaign ? campaign.name : 'Cargando campaña...'}</h1>
                    <EnemySelector addEnemy={handleAddEnemy} players={campaign ? campaign.players : []} /> {/* Componente para seleccionar enemigos */}
                    <ul>
                        {enemies.map((enemy, index) => (
                            <li key={index}>{enemy.name} (HP: {enemy.hp})</li>
                        ))}
                    </ul>
                    {campaign ? (
                        <>
                            <h3>Jugadores:</h3>
                            {Array.isArray(campaign.players) && campaign.players.length > 0 ? (
                                <ul>
                                    {campaign.players.map((player, index) => (
                                        <li key={index}>{player}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay jugadores en esta campaña.</p>
                            )}
                            <p>Fecha y Hora de Inicio: {new Date(campaign.startDate).toLocaleString()}</p>
                            <p>Lugar: {campaign.location}</p>
                        </>
                    ) : (
                        <p>Cargando información de la campaña...</p>
                    )}
                    <Button variant="light"><Link className='text-dark' to="/DNDcmanager">Regresar</Link></Button>
                </Col>
                {/* Panel Central */}
                <Col className='me-2 p-4 mt-3 bg-secondary rounded'>
                    <h3>Campo de Batalla</h3>
                    <Battleground/>
                </Col>
                {/*Dados, panel derecho*/}
                <Col md={3} className='me-2 p-2 mt-3 bg-secondary rounded'>
                    <DiceSet />
                </Col>
            </Row>
        </Container>
    );
}

export default CampaignPage;
