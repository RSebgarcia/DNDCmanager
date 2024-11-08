import React, {useState} from 'react';
import { Card, Button,Modal,Form } from 'react-bootstrap';
import './CharacterCard.css'

const CharacterCard = ({ character, onDamage, onDelete }) => {
    const [showDamageModal, setShowDamageModal] = useState(false);
    const [damage, setDamage] = useState(0);
        // Función para abrir el modal
        const handleOpenDamageModal = () => {
            setShowDamageModal(true);
        };
    
        // Función para cerrar el modal y reiniciar el daño ingresado
        const handleCloseDamageModal = () => {
            setShowDamageModal(false);
            setDamage(0);
        };
    
        // Función para confirmar el daño ingresado
        const handleConfirmDamage = () => {
            onDamage(damage);  // Ahora enviamos el daño ingresado a Battleground
            handleCloseDamageModal();
        };
        return (
            <Card className="character-card mb-3">
                <Card.Body>
                    {/* Título y botón de eliminación */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title>{character.name}</Card.Title>
                        <Button variant="danger" size="sm" onClick={onDelete}>x</Button>
                    </div>
    
                    {/* Salud y Clase de Armadura */}
                    <Card.Text>
                        {character.currentHealth !== undefined && (
                            <div>
                                <strong>HP:</strong> {character.currentHealth}
                            </div>
                        )}
                        {character.AC && (
                            <div>
                                <strong>AC:</strong> {character.AC}
                            </div>
                        )}
                    </Card.Text>
    
                    {/* Iniciativa y Tipo */}
                    <Card.Text>
                        <strong>Iniciativa:</strong> {character.initiative || 0}
                        {character.type && (
                            <div>
                                <strong>CR:</strong> {character.class}
                            </div>
                        )}
                    </Card.Text>
    
                    {/* Ataques */}
                    {character.attacks && character.attacks.length > 0 && (
                        <div>
                            <strong>Ataques:</strong>
                            <ul className="attack-list pl-3">
                                {character.attacks.map((attack, index) => (
                                    <li key={index}>
                                        {attack.name}: {attack.damage}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
    
                    {/* Botón de Daño */}
                    {character.type === 'Enemy' && (
                        <Button variant="danger" onClick={handleOpenDamageModal} className="mt-3">
                            Recibir Daño
                        </Button>
                    )}
                </Card.Body>
    
                {/* Modal para ingresar el daño */}
                <Modal show={showDamageModal} onHide={handleCloseDamageModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ingresar Daño</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Cantidad de Daño</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={damage}
                                    onChange={(e) => setDamage(Number(e.target.value))}
                                    min="0"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDamageModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleConfirmDamage}>
                            Aplicar Daño
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card>
        );
    };
    

export default CharacterCard;
