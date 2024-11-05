import React, { useEffect, useState } from 'react';
import { Button, ListGroup, Modal, Row, Col, Accordion } from 'react-bootstrap';
import EnemyModal from './EnemyModal'; // Importar el componente de modal de enemigos
import CharacterCard from './CharacterCard'; // Importar el nuevo componente CharacterCard

const EnemySelector = ({ campaignData }) => {
    const [enemies, setEnemies] = useState([]);
    const [allies, setAllies] = useState([]);
    const [newAlly, setNewAlly] = useState({ name: '', initiative: 0 });
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [showAddEnemyModal, setShowAddEnemyModal] = useState(false);
    const [showAddAllyModal, setShowAddAllyModal] = useState(false);
    const [invokedEnemies, setInvokedEnemies] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState(null);
    const [damageAmount, setDamageAmount] = useState(0);
    const [selectedEnemyIndex, setSelectedEnemyIndex] = useState(null);
    const [showDamageModal, setShowDamageModal] = useState(false);

    const players = campaignData?.players || [];

    useEffect(() => {
        const storedEnemies = JSON.parse(localStorage.getItem('enemies')) || [];
        setEnemies(storedEnemies);
    }, []);

    const handleAddEnemy = (newEnemy) => {
        const updatedEnemies = [
            ...enemies,
            { 
                ...newEnemy, 
                attacks: [
                    { name: 'Ataque 1', damage: '2d6' },
                    { name: 'Ataque 2', damage: '1d10' }
                ]
            }
        ];
        setEnemies(updatedEnemies);
        localStorage.setItem('enemies', JSON.stringify(updatedEnemies));
        setShowAddEnemyModal(false); // Cerrar el modal al agregar un enemigo
    };

    const handleAddAlly = () => {
        if (selectedPlayer || newAlly.name) {
            const allyName = selectedPlayer || newAlly.name;
            const updatedAllies = [...allies, { name: allyName, initiative: newAlly.initiative }];
            setAllies(updatedAllies);
            localStorage.setItem('allies', JSON.stringify(updatedAllies)); // Guarda los aliados en localStorage
            setShowAddAllyModal(false);
            setNewAlly({ name: '', initiative: 0 });
            setSelectedPlayer(''); // Reinicia el selector de jugadores
        } else {
            alert("Por favor, selecciona un jugador o completa el nombre del aliado.");
        }
    };

    const handleDeleteEntity = (indexToDelete, type) => {
        setEntityToDelete({ index: indexToDelete, type });
        setShowConfirmDelete(true);
    };

    const confirmDeleteEntity = () => {
        const { index, type } = entityToDelete;
        if (type === 'Enemy') {
            const updatedEnemies = enemies.filter((_, index) => index !== index);
            setEnemies(updatedEnemies);
            localStorage.setItem('enemies', JSON.stringify(updatedEnemies));
        } else {
            const updatedAllies = allies.filter((_, index) => index !== index);
            setAllies(updatedAllies);
            localStorage.setItem('allies', JSON.stringify(updatedAllies));
        }
        setShowConfirmDelete(false);
    };

    const handleCloseConfirm = () => {
        setShowConfirmDelete(false);
        setEntityToDelete(null);
    };

    const handleSelectEnemy = (enemy) => {
        const healthResult = rollDice(enemy.health);
        const initiativeResult = rollDice('1d20');

        const newInvokedEnemy = {
            ...enemy,
            currentHealth: healthResult,
            initiative: initiativeResult
        };

        const newInvokedEnemies = [...invokedEnemies, newInvokedEnemy];
        newInvokedEnemies.sort((a, b) => b.initiative - a.initiative);
        
        setInvokedEnemies(newInvokedEnemies);
    };

    const rollDice = (diceNotation) => {
        const [numDice, dieType] = diceNotation.split('d').map(Number);
        let total = 0;

        for (let i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * dieType) + 1;
        }

        return total;
    };

    const handleDamage = (index) => {
        setSelectedEnemyIndex(index);
        setShowDamageModal(true);
    };

    const handleConfirmDamage = () => {
        if (selectedEnemyIndex !== null) {
            const enemyToDamage = invokedEnemies[selectedEnemyIndex];
            const newHealth = enemyToDamage.currentHealth - damageAmount;

            if (newHealth <= 0) {
                const updatedEnemies = invokedEnemies.filter((_, index) => index !== selectedEnemyIndex);
                setInvokedEnemies(updatedEnemies);
            } else {
                const updatedEnemies = invokedEnemies.map((enemy, index) =>
                    index === selectedEnemyIndex ? { ...enemy, currentHealth: newHealth } : enemy
                );
                setInvokedEnemies(updatedEnemies);
            }

            setShowDamageModal(false);
            setDamageAmount(0);
        }
    };

    // Combina y ordena aliados y enemigos
    const combinedList = [
        ...allies.map(ally => ({ ...ally, type: 'Ally' })), 
        ...invokedEnemies.map(enemy => ({ ...enemy, type: 'Enemy' }))
    ];
    combinedList.sort((a, b) => b.initiative - a.initiative); // Ordenar por iniciativa

    return (
        <div>
            <h1>Enemy Selector</h1>
            <div className="d-flex mb-2">
                <Button variant="primary" onClick={() => setShowAddEnemyModal(true)} className="me-2">
                    Crear Enemigo
                </Button>
                <Button variant="success" onClick={() => setShowAddAllyModal(true)}>
                    Agregar Aliado
                </Button>
            </div>

            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Enemigos Disponibles</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            {enemies.map((enemy, index) => (
                                <ListGroup.Item key={index} style={{ cursor: 'pointer' }}>
                                    <strong>{enemy.name}</strong>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteEntity(index, 'Enemy')} className="float-end">
                                        Eliminar
                                    </Button>
                                    <Button variant="success" size="sm" onClick={() => handleSelectEnemy(enemy)} className="float-end me-2">
                                        Invocar
                                    </Button>
                                    <Button variant="warning" size="sm" onClick={() => handleDamage(index)} className="float-end me-2">
                                        Recibir Daño
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <h2 className="mt-4">Invocados (Aliados y Enemigos)</h2>
            <Row>
                {combinedList.map((character, index) => (
                    <Col key={index} sm={4} className="mb-3">
                        <CharacterCard 
                            character={character} 
                            onDamage={() => handleDamage(index)} 
                            onDelete={() => handleDeleteEntity(index, character.type)} // Enviar el tipo para la función de eliminación
                        />
                    </Col>
                ))}
            </Row>

            <Modal show={showAddEnemyModal} onHide={() => setShowAddEnemyModal(false)}>
                <EnemyModal 
                    onAddEnemy={handleAddEnemy} 
                    onClose={() => setShowAddEnemyModal(false)} 
                />
            </Modal>

            <Modal show={showAddAllyModal} onHide={() => setShowAddAllyModal(false)}>
                <div>
                    <h2>Agregar Aliado</h2>
                    <select onChange={e => setSelectedPlayer(e.target.value)} value={selectedPlayer}>
                        <option value="">Selecciona un jugador</option>
                        {players.map((player, index) => (
                            <option key={index} value={player.name}>{player.name}</option>
                        ))}
                    </select>
                    <input 
                        type="text" 
                        placeholder="Nombre del Aliado" 
                        value={newAlly.name} 
                        onChange={e => setNewAlly({ ...newAlly, name: e.target.value })} 
                    />
                    <input 
                        type="number" 
                        placeholder="Iniciativa" 
                        value={newAlly.initiative} 
                        onChange={e => setNewAlly({ ...newAlly, initiative: e.target.value })} 
                    />
                    <Button onClick={handleAddAlly}>Agregar</Button>
                </div>
            </Modal>

            <Modal show={showConfirmDelete} onHide={handleCloseConfirm}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar este {entityToDelete?.type === 'Enemy' ? 'enemigo' : 'aliado'}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirm}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDeleteEntity}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDamageModal} onHide={() => setShowDamageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Daño a Enemigo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input 
                        type="number" 
                        placeholder="Cantidad de Daño" 
                        value={damageAmount} 
                        onChange={e => setDamageAmount(e.target.value)} 
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDamageModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={handleConfirmDamage}>Confirmar Daño</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EnemySelector;
