// BattleSimulator.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CharacterList from './CharacterList';
import ActionPanel from './ActionPanel';
import BattleLog from './BattleLog';
import './BattleSimulator.css';

const BattleSimulator = () => {
    const [characters, setCharacters] = useState([]);  // Lista de personajes
    const [turnOrder, setTurnOrder] = useState([]);    // Orden de iniciativa
    const [currentTurn, setCurrentTurn] = useState(0); // Índice del turno actual
    const [battleLog, setBattleLog] = useState([]);    // Historial de la batalla

    // Funciones para añadir, eliminar personajes, gestionar turnos, etc.
    const addCharacter = (newCharacter) => {
        setCharacters([...characters, newCharacter]);
        // Recalcular la iniciativa aquí
    };

    const nextTurn = () => {
        setCurrentTurn((currentTurn + 1) % turnOrder.length);
        // Agregar log para el cambio de turno
    };

    const logAction = (action) => {
        setBattleLog([action, ...battleLog]);
    };

    return (
        <Container className="battle-simulator bg-dark text-light p-3 rounded">
            <Row>
                <Col md={4}>
                    <CharacterList characters={characters} addCharacter={addCharacter} />
                </Col>
                <Col md={4}>
                    <ActionPanel currentCharacter={characters[turnOrder[currentTurn]]} logAction={logAction} />
                </Col>
                <Col md={4}>
                    <BattleLog battleLog={battleLog} />
                </Col>
            </Row>
            <Row className="mt-3">
                <Button onClick={nextTurn}>Avanzar Turno</Button>
            </Row>
        </Container>
    );
};

export default BattleSimulator;
