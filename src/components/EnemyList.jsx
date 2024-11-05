import React, { useEffect, useState } from 'react';
import EnemyModal from './EnemyModal';
import { Button, Modal, Card, Form, Spinner, Row, Col } from 'react-bootstrap';

const CharacterList = () => {
    const [enemies, setEnemies] = useState([]);
    const [selectedEnemy, setSelectedEnemy] = useState(null);
    const [showEnemyModal, setShowEnemyModal] = useState(false);
    const [showSelectorModal, setShowSelectorModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingEnemy, setLoadingEnemy] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [battlefield, setBattlefield] = useState([]); // Estado para almacenar enemigos en el campo de batalla

    useEffect(() => {
        const fetchEnemies = async () => {
            try {
                const response = await fetch('https://www.dnd5eapi.co/api/monsters/');
                const data = await response.json();
                
                // Realizamos el segundo fetch para obtener los detalles de cada enemigo
                const enemyDetailsPromises = data.results.map(async (enemy) => {
                    const enemyResponse = await fetch(`https://www.dnd5eapi.co${enemy.url}`);
                    const enemyDetails = await enemyResponse.json();
                    return enemyDetails; // Retorna los detalles del enemigo
                });

                // Esperamos a que se resuelvan todas las promesas
                const detailedEnemies = await Promise.all(enemyDetailsPromises);
                setEnemies(detailedEnemies); // Seteamos la lista detallada de enemigos
            } catch (error) {
                console.error("Error fetching enemies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnemies();
    }, []);

    const handleEnemySelect = (enemy) => {
        setSelectedEnemy(enemy); // Guarda los detalles del enemigo seleccionado
        setShowEnemyModal(true); // Abre el modal
        setShowSelectorModal(false); // Cierra el modal de selección
    };

    const handleClose = () => {
        setShowEnemyModal(false);
        setSelectedEnemy(null); // Resetea el enemigo seleccionado al cerrar el modal
    };

    const handleAddEnemy = (enemyDetails) => {
        setBattlefield((prev) => [...prev, enemyDetails]); // Agrega el enemigo al campo de batalla
        // Aquí puedes hacer otras acciones como guardar en un estado global o en el backend
    };

    const filteredEnemies = enemies.filter(enemy =>
        enemy.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>Select an Enemy</h1>
            <Button onClick={() => setShowSelectorModal(true)}>Seleccionar Enemigo</Button>

            {/* Modal para seleccionar enemigos */}
            <Modal show={showSelectorModal} onHide={() => setShowSelectorModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Enemigos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="searchTerm">
                        <Form.Label>Buscar por Nombre</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ingresa el nombre del enemigo" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </Form.Group>

                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : (
                        <Row>
                            {filteredEnemies.length > 0 ? (
                                filteredEnemies.map((enemy) => (
                                    <Col key={enemy.index} md={4} className="mb-3">
                                        <Card onClick={() => handleEnemySelect(enemy)} style={{ cursor: 'pointer' }}>
                                            <Card.Body>
                                                <Card.Title>{enemy.name}</Card.Title>
                                                <Card.Text>
                                                    <strong>Index:</strong> {enemy.index}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <Card>
                                        <Card.Body>No se encontraron enemigos que coincidan.</Card.Body>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSelectorModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para mostrar detalles del enemigo */}
            {selectedEnemy && (
                <EnemyModal
                    showModal={showEnemyModal}
                    handleClose={handleClose}
                    enemy={selectedEnemy}
                    onAddEnemy={handleAddEnemy} // Asegúrate de que esta línea esté presente
                />
            )}
        </div>
    );
};

export default CharacterList;
