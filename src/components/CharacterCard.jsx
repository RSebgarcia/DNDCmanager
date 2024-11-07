import React, {useState} from 'react';
import { Card, Button,Modal,Form } from 'react-bootstrap';

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
        <Card className="mb-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>{character.name}</Card.Title>
                    <Button variant="danger" size="sm" onClick={onDelete}>x</Button>
                </div>
                <Card.Text>
                    {character.currentHealth !== undefined && (
                        <><strong>Salud Actual:</strong> {character.currentHealth}<br /></>
                    )}
                    {character.AC && <><strong>Clase de Armadura (AC):</strong> {character.AC}<br /></>}
                    <strong>Iniciativa:</strong> {character.initiative || 0} <br />
                    {character.type && <><strong>Tipo:</strong> {character.type}<br /></>}
                    {character.attacks && character.attacks.length > 0 && (
                        <div>
                            <strong>Ataques:</strong>
                            <ul>
                                {character.attacks.map((attack, index) => (
                                    <li key={index}>{attack.name}: {attack.damage}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card.Text>
                {character.type === 'Enemy' && (
                    <Button variant="danger" onClick={handleOpenDamageModal}>Recibir Daño</Button>
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
