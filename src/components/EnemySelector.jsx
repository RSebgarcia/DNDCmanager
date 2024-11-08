import React, { useState, useEffect } from 'react';
import { Accordion, Button, Container, ListGroup, Modal, Row, Col } from 'react-bootstrap';
import { useDrag } from 'react-dnd';  // Importamos useDrag
import EnemyModal from './EnemyModal';

const EnemySelector = ({ players }) => {
    const [enemies, setEnemies] = useState([]);
    const [allies, setAllies] = useState([]);
    const [newAlly, setNewAlly] = useState({ name: '', initiative: 0 });
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [showAddEnemyModal, setShowAddEnemyModal] = useState(false);
    const [showAddAllyModal, setShowAddAllyModal] = useState(false);
    const [showJsonModal, setShowJsonModal] = useState(false);
    
    // Cargar datos de localStorage al iniciar el componente solo una vez
    useEffect(() => {
        const storedEnemies = JSON.parse(localStorage.getItem('enemies')) || [];
        const storedAllies = JSON.parse(localStorage.getItem('allies')) || [];
        const currentCampaign = JSON.parse(localStorage.getItem('currentCampaign'));
    
        // Si la lista de aliados en `localStorage` está vacía, añadimos los personajes predeterminados
        if (storedAllies.length === 0 && currentCampaign && currentCampaign.players) {
            const defaultAllies = currentCampaign.players.map((playerName) => ({ name: playerName }));
            setAllies(defaultAllies);
            localStorage.setItem('allies', JSON.stringify(defaultAllies));
        } else {
            setAllies(storedAllies);
        }
    
        setEnemies(storedEnemies);
    }, []);
    // Guardar enemigos y aliados en localStorage cada vez que cambian, si tienen datos
    useEffect(() => {
        if (enemies.length > 0) {
            localStorage.setItem('enemies', JSON.stringify(enemies));
        }
    }, [enemies]);

    useEffect(() => {
        if (allies.length > 0) {
            localStorage.setItem('allies', JSON.stringify(allies));
        }
    }, [allies]);


    // Función para agregar un enemigo y cerrar el modal
    const handleAddEnemy = (newEnemy) => {
        setEnemies((prev) => [...prev, newEnemy]);
        setShowAddEnemyModal(false);
    };
    
  // Función para agregar un aliado
  const handleAddAlly = () => {
    const allyName = selectedPlayer || newAlly.name;
    if (allyName) {
        const newAllyWithHealth = { name: allyName, health: '1d1' };  // Asignar 1 de vida por defecto
        setAllies((prev) => [...prev, newAllyWithHealth]);
        setShowAddAllyModal(false);
        setNewAlly({ name: '' });
        setSelectedPlayer('');
    } else {
        alert("Por favor, selecciona un jugador o completa el nombre del aliado.");
    }
};

    // Función para exportar enemigos y aliados a un archivo JSON
    const exportEnemiesAndAllies = () => {
        const data = { enemies, allies };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        saveAs(blob, 'enemies_allies.json');
    };

    // Función para mostrar el modal de importación JSON
    const handleJsonModal = () => {
        setShowJsonModal(true);
    };
    // Función para importar enemigos y aliados desde un archivo JSON
    const importEnemiesAndAllies = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.enemies && data.allies) {
                    setEnemies(data.enemies);
                    setAllies(data.allies);
                } else {
                    alert("El archivo JSON debe contener listas de 'enemies' y 'allies'.");
                }
            } catch (error) {
                alert("Error al cargar el archivo JSON. Asegúrate de que el formato sea correcto. " + error.message);
            }
        };
        reader.readAsText(file);
    };


    const EnemyItem = ({ enemy }) => {
        // Hacemos que cada enemigo sea arrastrable
        const [{ isDragging }, drag] = useDrag(() => ({
            type: 'CHARACTER',
            item: { character: enemy },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));
        return (
            <ListGroup.Item
                ref={drag}  // Asignamos el ref de drag para permitir el arrastre
                style={{ opacity: isDragging ? 0.5 : 1 }}  // Estilo para reducir opacidad mientras se arrastra
            >
                <span><strong>{enemy.name}</strong> HP: {enemy.health}  CR: {enemy.class}</span>
            </ListGroup.Item>
        );
    };


        const AllyItem = ({ ally }) => {
            const [{ isDragging }, drag] = useDrag(() => ({
                type: 'ALLY',
                item: { character: ally },
                collect: (monitor) => ({
                    isDragging: !!monitor.isDragging(),
                }),
            }));

            return (
                <ListGroup.Item
                    ref={drag}
                    style={{ opacity: isDragging ? 0.5 : 1 }}
                >
                    <span><strong>{ally.name}</strong></span>
                </ListGroup.Item>
            );
        };


    return (
        <Container fluid >

            <Row className='mb-4'>
                <Col >
                    <Button variant="primary" onClick={() => setShowAddEnemyModal(true)} className="me-2">Crear Enemigo</Button>
                </Col>


                <Col >
                    <Button variant="success" onClick={() => setShowAddAllyModal(true)}>Agregar Aliado</Button>
                </Col>


                <Col >
                    <Button variant="dark" onClick={exportEnemiesAndAllies} className="me-2">Exportar JSON</Button>
                </Col>


                <Col >
                    <Button variant="dark" onClick={handleJsonModal} className="me-2">Importar JSON</Button>
                </Col>
            </Row>
            <Row>



                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Enemigos Disponibles</Accordion.Header>
                        <Accordion.Body>
                            <ListGroup>
                                {enemies.map((enemy, index) => (
                                    <EnemyItem key={index} enemy={enemy} />
                                ))}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Aliados Disponibles</Accordion.Header>
                        <Accordion.Body>
                            <ListGroup>
                                {allies.map((ally, index) => (
                                    <ListGroup.Item key={index}>
                                        <AllyItem key={index }ally={ally}/>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Accordion.Body>
                </Accordion.Item>
            </Accordion>
                
            </Row>


            {/*--------------------------------------------------------------MODALES----------------------------------------------------*/}



            <EnemyModal show={showAddEnemyModal} onHide={() => setShowAddEnemyModal(false)} onAdd={handleAddEnemy} />
            <Modal show={showJsonModal} onHide={() => setShowJsonModal(false)}>
                <Modal.Header closeButton><Modal.Title>Importar Lista de Enemigos</Modal.Title></Modal.Header>
                <Modal.Body>
                    <input
                        type="file"
                        accept="application/json"
                        onChange={(e) => importEnemiesAndAllies(e.target.files[0])}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowJsonModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={importEnemiesAndAllies}>Importar</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showAddAllyModal} onHide={() => setShowAddAllyModal(false)}>
                <Modal.Header closeButton><Modal.Title>Agregar Aliado</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newAlly.name}
                            onChange={(e) => setNewAlly({ ...newAlly, name: e.target.value })}
                            className="form-control"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddAllyModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={handleAddAlly}>Agregar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EnemySelector;
