import React from "react";
import { Card } from "../Styles/Styled";

const Deck = ({ suits, values, selectedKeys, onClickCard }) => (
	<>
		{suits.map(suit => (
			<div key={suit}>
				{values.map(value => (
					<Card 
						key={suit+value}
						suit={suit} 
						value={value} 
						selected={selectedKeys.includes(suit+value)}
						onClick={() => onClickCard(suit+value)}>
						{value}
					</Card>
				))}
			</div>
		))}
	</>
);

export default Deck;
