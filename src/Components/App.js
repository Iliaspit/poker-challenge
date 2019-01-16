import React, { Component } from 'react';

import { suits, values, generateNewPlayer, stringifyArray } from "../utils";

import Layout from "./Layout";
import Deck from "./Deck";
import { Button, Footer } from "../Styles/Styled";
import Player from './Player';
const poker = require('poker-hands');

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			players: [
				{
					name: 'Ilias',
					suits: ['D'],
					values: ["A", "K", "Q", "J", "T"],
					keys: ["DA", "DK", "DQ", "DJ", "DT"]
				},
				{
					name: 'Germain',
					suits: ['S'],
					values: ["A", "K", "Q", "J", "T"],
					keys: ["SA", "SK", "SQ", "SJ", "ST"]
				}
			],
			selectedKeys: [],
			nameOfPlayerBeingEdited: null
		}

		this.addNewPlayer = this.addNewPlayer.bind(this);
		this.renderPlayers = this.renderPlayers.bind(this);
		this.addNewPlayer = this.addNewPlayer.bind(this);
		this.removePlayer = this.removePlayer.bind(this);
		this.addCardToHand = this.addCardToHand.bind(this);
		this.removeCardFromHand = this.removeCardFromHand.bind(this);
		this.getSelectedKeys = this.getSelectedKeys.bind(this);
		this.editPlayer = this.editPlayer.bind(this);
		this.clickOnCard = this.clickOnCard.bind(this);
		this.findTheWinner = this.findTheWinner.bind(this);
	}

	componentDidMount() {
		const allKeys = this.getSelectedKeys();
		this.setState({
			selectedKeys: allKeys
		});
	}

	getSelectedKeys(players=this.state.players) {
		const allSelectedKeys = players.map(player => (player.keys));
		return allSelectedKeys.reduce((accumulator, currentValue) => accumulator.concat(currentValue));
	}
	
	addNewPlayer() {
		const {players} = this.state;
		if (players.length < 6) {
			const namesSelected = players.map(player => player.name);
			const newPlayer = generateNewPlayer(namesSelected, this.state.selectedKeys);
			const playersUpdated = players.concat(newPlayer)
			const selectedKeys = this.getSelectedKeys();
			const selectedKeysUpdated = selectedKeys.concat(newPlayer.keys);
			
			this.setState({
				players: playersUpdated,
				selectedKeys: selectedKeysUpdated
			});
		}
	}

	editPlayer(name) {
		const {nameOfPlayerBeingEdited} = this.state;
		const updatedName = nameOfPlayerBeingEdited === name ? null : name
		this.setState({
			nameOfPlayerBeingEdited: updatedName
		});
	}

	removeCardFromHand(players, nameOfPlayerBeingEdited, cardKey, cardValue) {
		return players.map(player => {
			if (player.name === nameOfPlayerBeingEdited) {
				player.keys = player.keys.filter(key => key !== cardKey);
				player.values = player.values.filter(value => value !== cardValue);
			}
			return player
		})
	}

	addCardToHand(players, nameOfPlayerBeingEdited, cardKey, cardValue) {
		return players.map(player => {
			if (player.name === nameOfPlayerBeingEdited) {
				player.keys = player.keys.concat(cardKey);
				player.values = player.values.concat(cardValue);
			}
			return player
		})
	}


	clickOnCard(cardKey) {
		let selectedKeysUpdated;
		let playersUpdated;
		const {players, nameOfPlayerBeingEdited} = this.state;
		if (!nameOfPlayerBeingEdited) return null;

		const playerBeingEdited = players.find(player => player.name === nameOfPlayerBeingEdited);
		const editedPlayerHasCard = playerBeingEdited && playerBeingEdited.keys.includes(cardKey);
		const editedPlayerHandLength = playerBeingEdited && playerBeingEdited.keys.length;
		const cardValue = cardKey.charAt(1);
		const selectedKeys = this.getSelectedKeys();
		if (selectedKeys.includes(cardKey) && editedPlayerHasCard) {
			// unselect it on Deck
			selectedKeysUpdated = selectedKeys.filter(key => key !== cardKey);			
			playersUpdated = this.removeCardFromHand(players, nameOfPlayerBeingEdited, cardKey, cardValue)
		} else if (!selectedKeys.includes(cardKey) && editedPlayerHandLength < 5) {
			// select it on Deck
			selectedKeysUpdated = selectedKeys.concat(cardKey);
			playersUpdated = this.addCardToHand(players, nameOfPlayerBeingEdited, cardKey, cardValue)
		}

		if (selectedKeysUpdated && playersUpdated) {
			this.setState({
				selectedKeys: selectedKeysUpdated,
				players: playersUpdated
			});
		}
	}

	removePlayer(name) {
		const {players} = this.state;
		const updatedPlayers = players.filter(player => (player.name !== name));
		const selectedKeysUpdated = this.getSelectedKeys(updatedPlayers);
 		if (players.length > 2) {
			this.setState({
				players: updatedPlayers,
				selectedKeys: selectedKeysUpdated
			});
		}
	}

	findTheWinner() {
		let winner;
		const {players} = this.state;
		const playersWithoutFiveCards = players.find(player => player.keys.length !== 5 )
		if (playersWithoutFiveCards) return alert('Please make sure all players have 5 cards');
		loop1:
			for (const player of players) {
				const playerHand = stringifyArray(player.keys);
				for (var i = 1; i < players.length; i++) {
					const compPlayerHandStr = stringifyArray(players[i].keys);
					const winnerIndex = poker.judgeWinner([playerHand, compPlayerHandStr]);
					if (winnerIndex === 1) {
						break;
					}
					if (i === players.length - 1) { 
						winner = player.name;
						alert(`The winner is ${winner}`)
						break loop1;
					}
				}
			}
		return winner;
	}

	renderPlayers() {
		const {players, nameOfPlayerBeingEdited} = this.state
		return players.map(player => {
			const {name, keys} = player;
			return (
				<Player
					key={name+keys.join()}
					name={name} 
					keys={keys}
					onClickRemove={this.removePlayer}
					onClickEdit={this.editPlayer}
					isPlayerSelected={name === nameOfPlayerBeingEdited}
					onClickOnCard={this.clickOnCard}
				/>
			);
		})
	}

	render() {
		return (
				<Layout>

					<section>
						<h1>
						Cards deck
						</h1>
						<Deck 
							suits={suits} 
							values={values} 
							selectedKeys={this.state.selectedKeys}
							onClickCard={this.clickOnCard}
						/>
					</section>
					<section>
						<header>
							<h1>Players</h1>
						</header>
						<section>
							{this.renderPlayers()}
						</section>
						<Footer>
								<Button onClick={() => this.addNewPlayer()}>
									<span role="img" alt="woman raising hand" aria-label="woman raising hand">🙋‍♀️</span>
									Add new player
								</Button>
								<Button onClick={() => this.findTheWinner()}>
									<span role="img" alt="trophy" aria-label="trophy">🏆</span>
									Find the winner
								</Button>
						</Footer>
					</section>

				</Layout>
		);
	}
}

export default App;
