import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EnemyModal = ({ show, onHide, onAdd }) => {
    const [enemy, setEnemy] = useState({
        name: '',
        AC: '',
        race: '',
        class: '',
        type: 'Enemy',
        health: '1d10',
        attacks: [],
    });

    // Agregar un ataque
    const handleAddAttack = () => {
        setEnemy((prev) => ({
            ...prev,
            attacks: [...prev.attacks, { id: prev.attacks.length, name: '', damage: '' }],
        }));
    };

    // Cambiar un ataque específico
    const handleAttackChange = (index, field, value) => {
        const updatedAttacks = [...enemy.attacks];
        updatedAttacks[index][field] = value;
        setEnemy({ ...enemy, attacks: updatedAttacks });
    };

    // Calcular vida (HP) a partir de la notación de dados, ej. "1d10"
    const calculateHP = () => {
        const match = enemy.health.match(/^(\d+)d(\d+)$/i);
        if (!match) {
            alert("Formato de vida inválido. Usa el formato 'XdY', por ejemplo, '1d10'");
            return 1; // valor por defecto en caso de error
        }
        
        const [_, count, type] = match.map(Number);
        let hp = 0;
        for (let i = 0; i < count; i++) {
            hp += Math.floor(Math.random() * type) + 1;
        }
        return hp;
    };
  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    const finalHP = calculateHP();
    onAdd({ ...enemy, currentHealth: finalHP });
    setEnemy({
        name: '',
        AC: '',
        race: '',
        class: '',
        type: 'Enemy',
        health: '1d10',
        attacks: [],
    });
    onHide();
};


    return (
        <Modal show={show} onHide={onHide} backdrop="static">
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
                        <Form.Label>AC</Form.Label>
                        <Form.Control
                            type="number"
                            value={enemy.AC}
                            onChange={(e) => setEnemy({ ...enemy, AC: e.target.value })}
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
                        <Form.Label>Clasificación:</Form.Label>
                        <Form.Control
                            type="text"
                            value={enemy.class}
                            onChange={(e) => setEnemy({ ...enemy, class: e.target.value })}
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

                    {/* Campos para ataques */}
                    <Form.Label>Ataques</Form.Label>
                    {enemy.attacks.map((attack, index) => (
                        <div key={attack.id} className="mb-3">
                            <Form.Group>
                                <Form.Label>Nombre del Ataque</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={attack.name}
                                    onChange={(e) => handleAttackChange(index, 'name', e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Daño</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={attack.damage}
                                    onChange={(e) => handleAttackChange(index, 'damage', e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={handleAddAttack} className="mt-2">
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
