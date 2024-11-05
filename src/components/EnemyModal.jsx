import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EnemyModal = ({ show, onHide, onAddEnemy }) => {
    const [enemy, setEnemy] = useState({
        name: '',
        class: '',
        race: '',
        type: '',
        health: '1d10',
        attack1: '',
        attacks: [], // Para almacenar ataques adicionales
    });

    const handleAddAttack = () => {
        setEnemy((prev) => ({
            ...prev,
            attacks: [...prev.attacks, { id: prev.attacks.length, name: '' }],
        }));
    };

    const handleAttackChange = (index, value) => {
        const updatedAttacks = [...enemy.attacks];
        updatedAttacks[index].name = value;
        setEnemy({ ...enemy, attacks: updatedAttacks });
    };

    const handleSubmit = () => {
        onAddEnemy(enemy);
        setEnemy({
            name: '',
            class: '',
            race: '',
            type: '',
            health: '1d10',
            attack1: '',
            attacks: [],
        }); // Reiniciar el estado
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Crear Enemigo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Nombre del Enemigo</Form.Label>
                        <Form.Control
                            type="text"
                            value={enemy.name}
                            onChange={(e) => setEnemy({ ...enemy, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Clase</Form.Label>
                        <Form.Control
                            type="text"
                            value={enemy.class}
                            onChange={(e) => setEnemy({ ...enemy, class: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Raza</Form.Label>
                        <Form.Control
                            type="text"
                            value={enemy.race}
                            onChange={(e) => setEnemy({ ...enemy, race: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                            type="text"
                            value={enemy.type}
                            onChange={(e) => setEnemy({ ...enemy, type: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Vida (ej. 1d10)</Form.Label>
                        <Form.Control
                            type="text"
                            value={enemy.health}
                            onChange={(e) => setEnemy({ ...enemy, health: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ataque 1</Form.Label>
                        <Form.Control
                            type="text"
                            value={enemy.attack1}
                            onChange={(e) => setEnemy({ ...enemy, attack1: e.target.value })}
                        />
                    </Form.Group>
                    {enemy.attacks.map((attack, index) => (
                        <Form.Group key={attack.id}>
                            <Form.Label>Ataque {index + 2}</Form.Label>
                            <Form.Control
                                type="text"
                                value={attack.name}
                                onChange={(e) => handleAttackChange(index, e.target.value)}
                            />
                        </Form.Group>
                    ))}
                    <Button variant="secondary" onClick={handleAddAttack}>
                        Agregar Ataque
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Agregar Enemigo
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EnemyModal;
