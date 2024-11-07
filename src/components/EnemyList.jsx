import React, { useEffect, useState } from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';

const EnemyList = ({ onSelectEnemy }) => {
    const [enemies, setEnemies] = useState([]);

    useEffect(() => {
        const loadEnemies = () => {
            const storedEnemies = localStorage.getItem('enemies');
            if (storedEnemies) {
                setEnemies(JSON.parse(storedEnemies));
            }
        };
        
        loadEnemies();
    }, []);

    return (
        <div>
            <h2>Enemigos Cargados</h2>
            <Row>
                {enemies.length > 0 ? (
                    enemies.map((enemy, index) => (
                        <Col md={4} key={index} style={{ marginBottom: '20px' }}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{enemy.name}</Card.Title>
                                    <Card.Text>
                                        Tipo: {enemy.type}<br />
                                        Vida: {enemy.health}<br />
                                        Daño: {enemy.attack}<br />
                                        Defensa: {enemy.defense}<br />
                                        Experiencia: {enemy.experience}
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => onSelectEnemy(enemy)}>
                                        Invocar Enemigo
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No hay enemigos cargados.</p>
                )}
            </Row>
        </div>
    );
};

export default EnemyList;
