import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const NewCampaignModal = ({ show, onClose, onSaveCampaign }) => {
    const [campaignName, setCampaignName] = useState('');
    const [playerCount, setPlayerCount] = useState(1);
    const [playerNames, setPlayerNames] = useState(['']);
    const [startDate, setStartDate] = useState('');
    const [location, setLocation] = useState('');

    // Función para actualizar el nombre del jugador en el índice correspondiente
    const handlePlayerNameChange = (index, value) => {
        const newPlayerNames = [...playerNames];
        newPlayerNames[index] = value;
        setPlayerNames(newPlayerNames);
    };

    // Ajustar la cantidad de campos de jugador según el número seleccionado
    const handlePlayerCountChange = (count) => {
        setPlayerCount(count);
        setPlayerNames(Array.from({ length: count }, (_, i) => playerNames[i] || ''));
    };

    // Guardar la campaña
    const saveCampaign = () => {
        const newCampaign = {
            id: Date.now(), // Genera un ID único usando la fecha actual en milisegundos
            name: campaignName,
            playerCount,
            players: playerNames,
            startDate,
            location,
        };
        onSaveCampaign(newCampaign);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva Campaña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="campaignName">
                        <Form.Label>Nombre de la Campaña</Form.Label>
                        <Form.Control
                            type="text"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="playerCount">
                        <Form.Label>Cantidad de Jugadores</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            max="10"
                            value={playerCount}
                            onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
                            required
                        />
                    </Form.Group>

                    {Array.from({ length: playerCount }).map((_, index) => (
                        <Form.Group key={index} controlId={`playerName${index}`}>
                            <Form.Label>Nombre del Jugador {index + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                value={playerNames[index] || ''}
                                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                                required
                            />
                        </Form.Group>
                    ))}

                    <Form.Group controlId="startDate">
                        <Form.Label>Fecha y Hora de Inicio</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="location">
                        <Form.Label>Lugar donde acontece la historia</Form.Label>
                        <Form.Control
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={saveCampaign}>
                    Guardar Campaña
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewCampaignModal;
