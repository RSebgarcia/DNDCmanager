// CharacterCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';

const CharacterCard = ({ character, onDamage, onDelete }) => {
    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>{character.name}</Card.Title>
                    <Button variant="danger" size="sm" onClick={onDelete}>
                        x
                    </Button>
                </div>
                <Card.Text>
                    {character.type === 'Enemy' ? `Salud Actual: ${character.currentHealth}` : ''}<br />
                    Iniciativa: {character.initiative}<br />
                    {character.type === 'Enemy' && character.attacks && character.attacks.length > 0 && (
                        <div>
                            <strong>Ataques:</strong>
                            <ul>
                                {character.attacks.map((attack, attackIndex) => (
                                    <li key={attackIndex}>{attack.name}: {attack.damage}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card.Text>
                {character.type === 'Enemy' && (
                    <Button variant="danger" onClick={onDamage}>
                        Recibir Daño
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default CharacterCard;
