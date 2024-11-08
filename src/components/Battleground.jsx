import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import CharacterCard from './CharacterCard';
import './Battleground.css';
import { Container, Col, Row, Modal, Button, Form } from 'react-bootstrap';

const Battleground = () => {
    const [characters, setCharacters] = useState([]);
    const [showInitiativeModal, setShowInitiativeModal] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [initiative, setInitiative] = useState(0);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ['CHARACTER', 'ALLY'],
        drop: (item, monitor) => handleDrop(item.character, monitor.getItemType()), // Asegúrate de que monitor.getItemType() devuelva 'ALLY'
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const calculateHP = (notation) => {
        if (typeof notation !== 'string') return 1;  // Agregar una validación para asegurarse de que `notation` es una cadena
        const match = notation.match(/^(\d+)d(\d+)$/i);
        if (!match) return 1;  // Valor por defecto si no tiene el formato adecuado
    
        const [_, count, type] = match.map(Number);
        let hp = 0;
        for (let i = 0; i < count; i++) {
            hp += Math.floor(Math.random() * type) + 1;
        }
        return hp;
    };
    
    // Función para eliminar un personaje específico usando su ID único
    const handleDeleteCharacter = (characterId) => {
        setCharacters((prev) => prev.filter((character) => character.id !== characterId));
    };

    // Función para aplicar daño a un personaje
    const handleDamage = (characterId, damage) => {
        setCharacters((prev) =>
            prev.map((character) => {
                if (character.id === characterId) {
                    const updatedHealth = character.currentHealth - damage;
                    if (updatedHealth <= 0) {
                        return null;
                    }
                    return { ...character, currentHealth: updatedHealth };
                }
                return character;
            }).filter((character) => character !== null)
        );
    };

    const handleDrop = (character, type) => {
        const initialHealth = calculateHP(character.health || '1d1'); // Asegúrate de que el valor de `health` esté en un formato adecuado
        const characterWithId = {
            ...character,
            id: Date.now(),
            currentHealth: initialHealth,
            initiative: type === 'ALLY' ? null : Math.floor(Math.random() * 20) + 1,
        };
    
        if (type === 'ALLY') {
            setSelectedCharacter({ ...characterWithId });
            setShowInitiativeModal(true);
        } else {
            setCharacters((prev) => [...prev, characterWithId]);
        }
    };

    const handleInitiativeSubmit = () => {
        if (selectedCharacter) {
            setCharacters((prev) => [
                ...prev,
                { ...selectedCharacter, initiative: parseInt(initiative, 10) },
            ]);
        }
        setShowInitiativeModal(false);
        setInitiative(0);
    };

    return (
        <Container ref={drop} className={`rounded whiteboard ${isOver ? 'highlight' : ''}`}>
            <Row className="g-3">
                {characters.sort((a, b) => b.initiative - a.initiative).map((character, index) => (
                    <Col key={character.id} md={3}>
                        <CharacterCard
                            character={character}
                            onDamage={(damage) => handleDamage(character.id, damage)}
                            onDelete={() => handleDeleteCharacter(character.id)}
                        />
                    </Col>
                ))}
            </Row>

            <Modal show={showInitiativeModal} onHide={() => setShowInitiativeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Iniciativa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Iniciativa del Aliado</Form.Label>
                            <Form.Control
                                type="number"
                                value={initiative}
                                onChange={(e) => setInitiative(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault(); // Evita la redirección
                                      handleInitiativeSubmit(); // Llama a la función de envío manualmente
                                    }}}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInitiativeModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleInitiativeSubmit}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Battleground;
