import React from "react";

import { shallow } from "enzyme";

import Deck from "./Deck";
import { Card } from "../Styles/Styled";

import { suits, values } from "../utils";

describe(`Card deck`, () => {
	let deck;
	let selectedKeys;

	beforeEach(() => {
		selectedKeys = ["DA", "DK", "DQ", "DJ", "DT"];
		deck = shallow(
			<Deck 
				suits={suits} 
				values={values} 
				selectedKeys={selectedKeys}
				onClickCard={jest.fn()}  
			/>
		)
	})

	afterEach(() => {
		deck = null
	})

	test('renders the right amount of cards', () => {
		expect(deck.find(Card)).toHaveLength(52);
	});

	test('displays correct number of selected cards', () => {
		const numberOfSelectedCard = deck.find(Card)
										.findWhere(
											 card => card.prop('selected') === true
										);
		expect(numberOfSelectedCard.length).toEqual(selectedKeys.length);
	});

	test('renders cards with the correct props', () => {
		const expectedProps = { 
			suit: 'D',
			value: '2',
			selected: false
		};

		const firstRenderedCardProps = (deck.find(Card).first().props());

		expect(firstRenderedCardProps.suit).toEqual(expectedProps.suit)
		expect(firstRenderedCardProps.value).toEqual(expectedProps.value)
		expect(firstRenderedCardProps.selected).toEqual(expectedProps.selected)
	})
});
