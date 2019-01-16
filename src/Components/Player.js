import React from "react";
import { Card, PlayerHand, Button } from "../Styles/Styled"; 

const Player = ({ name, keys, onClickRemove, onClickEdit, isPlayerSelected, onClickOnCard }) => {

    const renderCards = (keys) => {
        return keys.map(key => {
            const suit = key.charAt(0);
            const value = key.charAt(1);
            return (
                <Card 
                    key={key}
                    suit={suit} 
                    value={value} 
                    onClick={() => onClickOnCard(key)}>
                    {value}
                </Card>
            )}
        )
    }

    return (
        <>
            <article>
                <p>
                {name}
                <Button onClick={() => onClickEdit(name)} selected={isPlayerSelected}>
                    <span role="img" alt="pencil" aria-label="pencil">✏️</span>
                    Edit
                </Button>
                <Button onClick={() => onClickRemove(name)}>
                    <span role="img" alt="flame" aria-label="flame">🔥</span>
                    Remove
                </Button>
                </p>
                <PlayerHand>
                    {renderCards(keys)}
                </PlayerHand>
            </article>
        </>
    )
}

export default Player;