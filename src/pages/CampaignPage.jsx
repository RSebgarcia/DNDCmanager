import React, { useEffect, useState ,useCallback} from 'react';
import { Button, Container, Row, Col, NavbarBrand, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import WeatherInfo from '../components/WeatherInfo';
import DateTimeInfo from '../components/DateTimeInfo';
import DBHandler from '../components/DBHandler';

const CampaignPage = () => {
    const [campaign, setCampaign] = useState(null);
    const [campaignId, setCampaignId] = useState(null);
    const { campaigns, saveCampaignsToLocalStorage } = DBHandler();
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const loadedCampaign = JSON.parse(localStorage.getItem('currentCampaign'));
        if (loadedCampaign) {
            setCampaign(loadedCampaign);
            const id = loadedCampaign.id;
            setCampaignId(id);
            const lastGameTimestamp = localStorage.getItem(`campaign_${id}_lastGameTimestamp`);

            if (lastGameTimestamp) {
                setCurrentDateTime(new Date(lastGameTimestamp));
            } else {
                setCurrentDateTime(new Date(loadedCampaign.startDate));
            }
        }
    }, [campaigns]);

    const handleSaveTimestamp = useCallback((timestamp) => {
        if (campaignId !== null) {
            localStorage.setItem(`campaign_${campaignId}_lastGameTimestamp`, timestamp.toISOString());
            
            const currentCampaign = JSON.parse(localStorage.getItem('currentCampaign'));
            if (currentCampaign) {
                currentCampaign.lastGameTimestamp = timestamp.toISOString();
                localStorage.setItem('currentCampaign', JSON.stringify(currentCampaign));
                saveCampaignsToLocalStorage(campaigns);
            }
        }
    }, [campaignId, campaigns, saveCampaignsToLocalStorage]);

    return (
        <Container fluid className="campaign-page vw-100">
            <div className="campaign-navbar">
                <Container fluid>
                    <Row>
                        {campaign ? (
                            <NavbarBrand>{campaign.name}</NavbarBrand>
                        ) : (
                            <NavbarBrand>Cargando campaña...</NavbarBrand>
                        )}
                    </Row>
                    <Row>
                        <Col md={{ span: 3, offset: 2 }}>
                            {campaign && (
                                <WeatherInfo campaignId={campaignId} />
                            )}
                        </Col>
                        <Col md={{ span: 3, offset: 2 }}>
                            {campaign && campaignId !== null && (
                                <DateTimeInfo 
                                startDate={currentDateTime} 
                                campaignName={campaign.name} 
                                campaignId={campaignId}
                                onSaveTimestamp={handleSaveTimestamp}
                            />
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="campaign-info">
                {campaign ? (
                    <>
                        <h3>Jugadores:</h3>
                        <ul>
                            {campaign.players.map((player, index) => (
                                <li key={index}>{player}</li>
                            ))}
                        </ul>
                        <p>Fecha y Hora de Inicio: {new Date(campaign.startDate).toLocaleString()}</p>
                        <p>Lugar: {campaign.location}</p>
                    </>
                ) : (
                    <p>Cargando información de la campaña...</p>
                )}
            </div>
            <div className="combat-simulator">
                <h3>Simulador de Combate</h3>
                <p>Aquí irá el simulador de combate...</p>
            </div>
            <Button variant="primary"><Link to="/">Volver</Link></Button>
        </Container>
    );
};

export default CampaignPage;