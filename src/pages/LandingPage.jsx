import React, { useState } from 'react';
import { Button, ListGroup, Container, Modal,Row,Col } from 'react-bootstrap';
import NewCampaignModal from '../components/NewCampaignForm';
import { useNavigate } from 'react-router-dom';
import DBHandler from '../components/DBHandler';
import './LandingPage.css'

const LandingPage = () => {
    const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);
    const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);
    const [fileToImport, setFileToImport] = useState(null);

    const navigate = useNavigate();
    const { campaigns, saveCampaignsToLocalStorage, exportCampaigns, importCampaigns } = DBHandler();

    const loadCampaign = (campaign) => {
        const loadedCampaign = {
            ...campaign,
            startDate: new Date(campaign.startDate),
        };
        localStorage.setItem('currentCampaign', JSON.stringify(loadedCampaign));
        navigate('/DNDCmanager/campaign');
    };

    const handleSaveNewCampaign = (newCampaign) => {
        if (campaigns.length >= 3) {
            alert("Solo puedes tener hasta 3 campañas activas.");
            return;
        }
        const updatedCampaigns = [...campaigns, newCampaign];
        saveCampaignsToLocalStorage(updatedCampaigns);
    };

    const handleDeleteCampaign = (campaign) => {
        setCampaignToDelete(campaign);
        setShowDeleteModal(true);
    };

    const confirmDeleteCampaign = () => {
        // Asegúrate de que campaignToDelete tenga un ID
        if (campaignToDelete && campaignToDelete.id) {
            const updatedCampaigns = campaigns.filter(campaign => campaign.id !== campaignToDelete.id);
            saveCampaignsToLocalStorage(updatedCampaigns);
        }
        setShowDeleteModal(false);
        setCampaignToDelete(null);
    };

    const handleImportCampaigns = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileToImport(file);
            setShowImportConfirmModal(true);
        }
    };

    const confirmImportCampaigns = () => {
        importCampaigns(fileToImport);
        setShowImportConfirmModal(false);
    };

    return (
        <Container className="landing-page">
{/*--------------------------------------------------MainBTNS---------------------------------------------*/}
            <Row className='mb-5'>
            <h1 className="text-center">Gestión de Campañas</h1>
            <Col className="text-center">
                <Button variant="primary" onClick={() => setShowNewCampaignModal(true)} className="m-2">
                    Nueva Campaña
                </Button>
                <Button variant="light" className="m-2">
                    <label htmlFor="importCampaignsInput" style={{ cursor: 'pointer', margin: 0 }}>
                        Cargar Campaña
                    </label>
                </Button>
                <input
                    id="importCampaignsInput"
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleImportCampaigns}
                    />
                <Button variant="light" onClick={exportCampaigns} className="m-2">
                    Exportar Campañas
                </Button>
            </Col>
            </Row>

            {/*--------------------------------------------------Active CAMPAIGNS---------------------------------------------*/}
            <Row className='camp-master rounded'>
                <h2 className='text-light '>Campañas Activas</h2>
                <Col >
                    <ListGroup >
                        {campaigns.map((campaign) => (
                            <ListGroup.Item key={campaign.id} className='c-info'>
                                <Container className='campaingList '>
                                    <Row >
                                        <h5>{campaign.name}</h5>
                                        <p>Jugadores: {campaign.players.join(', ')}</p>
                                    </Row>
                                    <Row >
                                        <Col>
                                            <Button variant='light' onClick={() => loadCampaign(campaign)}>Cargar</Button>
                                        </Col>
                                        <Col>
                                            <Button variant='light' onClick={() => handleDeleteCampaign(campaign)}>Eliminar</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>


{/*--------------------------------------------------MODALS---------------------------------------------*/}
            <Modal show={showImportConfirmModal} onHide={() => setShowImportConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Carga de Campañas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Esto sobrescribirá tus campañas actuales. ¿Deseas continuar?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImportConfirmModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={confirmImportCampaigns}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar la campaña "{campaignToDelete?.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteCampaign}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
            <NewCampaignModal
                show={showNewCampaignModal}
                onClose={() => setShowNewCampaignModal(false)}
                onSaveCampaign={handleSaveNewCampaign}
            />
        </Container>
    );
};

export default LandingPage;
