import React, { useState } from 'react';
import { Button, ListGroup, Container, Modal } from 'react-bootstrap';
import NewCampaignModal from '../components/NewCampaignForm';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import DBHandler from '../components/DBHandler'; // Importa DBHandler

const LandingPage = () => {
    const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);
    const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);
    const [fileToImport, setFileToImport] = useState(null);

    const navigate = useNavigate();
    const { campaigns, saveCampaignsToLocalStorage, exportCampaigns, importCampaigns } = DBHandler(); // Usa DBHandler

    const loadCampaign = (campaign) => {
        const loadedCampaign = {
            ...campaign,
            startDate: new Date(campaign.startDate),
        };
        localStorage.setItem('currentCampaign', JSON.stringify(loadedCampaign));
        navigate('/campaign');
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
        const updatedCampaigns = campaigns.filter(campaign => campaign !== campaignToDelete);
        saveCampaignsToLocalStorage(updatedCampaigns);
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
            <h1 className="text-center">Gestión de Campañas</h1>
            <div className="text-center">
                <Button variant="primary" onClick={() => setShowNewCampaignModal(true)} className="m-2">
                    Nueva Campaña
                </Button>
                <Button variant="secondary" className="m-2">
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
                <Button variant="secondary" onClick={exportCampaigns} className="m-2">
                    Exportar Campañas
                </Button>
            </div>
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
            <h2>Campañas Activas</h2>
            <ListGroup>
                {campaigns.map((campaign, index) => (
                    <ListGroup.Item key={index}>
                        <h5>{campaign.name}</h5>
                        <p>Jugadores: {campaign.players.join(', ')}</p>
                        <Button variant='primary' onClick={() => loadCampaign(campaign)}>Cargar</Button>
                        <Button variant='danger' onClick={() => handleDeleteCampaign(campaign)}>Eliminar</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
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
