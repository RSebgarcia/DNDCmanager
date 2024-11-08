// DiceSet.jsx
import React, { useState } from 'react';
import { Button, Dropdown, Form, InputGroup, ListGroup, Container, Row, Col } from 'react-bootstrap';
import './DiceSet.css';

const diceTypes = [2, 4, 6, 8, 10, 12, 20, 100];

const DiceSet = () => {
    const [selectedDie, setSelectedDie] = useState(diceTypes[0]);
    const [diceCount, setDiceCount] = useState(1);
    const [rollHistory, setRollHistory] = useState([]);
    const [diceSets, setDiceSets] = useState([{ type: selectedDie, count: diceCount }]);

    const addDiceSet = () => {
        setDiceSets([...diceSets, { type: selectedDie, count: 1 }]);
    };

    const removeDiceSet = () => {
        setDiceSets(diceSets.slice(0, -1)); // Quita el último dado de la lista
    };

    const updateDiceSet = (index, field, value) => {
        const newDiceSets = [...diceSets];
        newDiceSets[index][field] = value;
        setDiceSets(newDiceSets);
    };

    const rollDice = () => {
        let grandTotal = 0;
        const results = diceSets.map(({ type, count }) => {
            const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * type) + 1);
            const total = rolls.reduce((sum, val) => sum + val, 0);
            grandTotal += total;
            return `${count}d${type}: [${rolls.join(', ')}] (${total})`;
        });

        const rollResult = `Total: ${grandTotal} | ${results.join(' | ')}`;
        setRollHistory([rollResult, ...rollHistory]);
    };
    return (
        <Container className="dice-set bg-dark p-3 rounded">
            <h4 className="text-light">Dice Roller</h4>
            <Row>
                {/* Dice Sets List */}
                <Col md={12}>
                    <ListGroup className="mb-3">
                        {diceSets.map((diceSet, index) => (
                            <ListGroup.Item key={index} className="d-flex align-items-center justify-content-between">
                                <Dropdown onSelect={(e) => updateDiceSet(index, 'type', Number(e))}>
                                    <Dropdown.Toggle variant="secondary">D{diceSet.type}</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {diceTypes.map((type) => (
                                            <Dropdown.Item key={type} eventKey={type}>
                                                D{type}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>

                                <InputGroup style={{ width: '130px' }}>
                                    <InputGroup.Text>Cant:</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={diceSet.count}
                                        onChange={(e) => updateDiceSet(index, 'count', Math.max(1, Number(e.target.value)))}
                                    />
                                </InputGroup>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Container >
                    <Row className='d-flex justify-items-center align-content-center'>
                        <Col >
                            <Button variant="success" onClick={addDiceSet} className="mb-3">+</Button>
                        </Col>
                        <Col  >
                            <Button variant="danger" onClick={removeDiceSet} className="mb-3">-</Button>
                        </Col>
                        <Col >
                            <Button variant="light" onClick={rollDice}>Lanzar</Button>
                        </Col>
                    </Row>
                </Container>
                {/* Roll History */}
                <div className="mt-3   dice-text">

                    <h5 className="text-dark">Historial de tiradas:</h5>
                    <ul className="list-unstyled">
                        {rollHistory.map((roll, index) => (
                            <li key={index} className={index === 0 ? 'fw-bold' : ''}>{roll}</li>
                        ))}
                    </ul>
                </div>
            </Row>
        </Container>
    );
};

export default DiceSet;
