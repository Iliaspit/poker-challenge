import React from 'react';
import ReactDOM from 'react-dom';

import sinon from 'sinon';
import { shallow } from "enzyme";

import App from './App';
import Layout from "./Layout";
import Deck from "./Deck";
import { Button, Footer } from "../Styles/Styled";
import Player from './Player';

const poker = require('poker-hands');

describe(`App`, () => {

  describe('Renders' , () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<App />, div);
      ReactDOM.unmountComponentAtNode(div);
    });
  })

  describe('App functionality', () => {
    let appShallowWrapper;
    let sandbox;

    beforeEach(() => {
      appShallowWrapper = shallow(<App />);
      appShallowWrapper.setState({
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
        selectedKeys: [
          "DA", "DK", "DQ", "DJ", "DT", "SA", "SK", "SQ", "SJ", "ST"
        ],
        nameOfPlayerBeingEdited: null
      })
      sandbox = sinon.createSandbox();
    })

    afterEach(() => {
      sandbox.restore();
    });

    it('renders the correct components', () => {
      const numberOfPlayers = appShallowWrapper.state().players.length;

      expect(appShallowWrapper.find(Layout).length).toEqual(1);
      expect(appShallowWrapper.find(Deck).length).toEqual(1);
      expect(appShallowWrapper.find(Button).length).toEqual(2);
      expect(appShallowWrapper.find(Footer).length).toEqual(1);
      expect(appShallowWrapper.find(Player).length).toEqual(numberOfPlayers);
    })

    it('should set the selectedKeys state correctly when component mounts', () => {
      appShallowWrapper.instance().componentDidMount();
      const state = appShallowWrapper.state();
      const selectedKeys = state.players.map(player => player.keys);
      const selectedKeysConcat = [...selectedKeys[0], ...selectedKeys[1]]
      expect(state.selectedKeys).toEqual(selectedKeysConcat);
    });

    it('should call addNewPlayer when addNewPlayer button is clicked', () => {
      const addNewPlayerSpy = sandbox.spy(appShallowWrapper.instance(), 'addNewPlayer');
      appShallowWrapper.find(Button).at(0).simulate('click');
      expect(addNewPlayerSpy).toHaveProperty('callCount', 1);
    })

    it('should update the state when new player is added', () => {
      const initialNumOfPlayers = appShallowWrapper.state().players.length;
      const initialNumOfSelectedKeys = appShallowWrapper.state().selectedKeys.length;
      
      appShallowWrapper.instance().addNewPlayer();

      const updatedNumOfPlayers = appShallowWrapper.state().players.length;
      const updatedNumOfSelectedKeys = appShallowWrapper.state().selectedKeys.length;
      
      expect(updatedNumOfPlayers).toEqual(initialNumOfPlayers + 1)
      expect(updatedNumOfSelectedKeys).toEqual(initialNumOfSelectedKeys + 5)
    })

    it('should not add new player if number of player is already 6', () => {
      appShallowWrapper.instance().addNewPlayer();
      appShallowWrapper.instance().addNewPlayer();
      appShallowWrapper.instance().addNewPlayer();
      appShallowWrapper.instance().addNewPlayer();
      appShallowWrapper.instance().addNewPlayer();
      appShallowWrapper.instance().addNewPlayer();
      appShallowWrapper.instance().addNewPlayer();

      const updatedNumOfPlayers = appShallowWrapper.state().players.length;
      const updatedNumOfSelectedKeys = appShallowWrapper.state().selectedKeys.length;
      
      expect(updatedNumOfPlayers).toEqual(6)
      expect(updatedNumOfSelectedKeys).toEqual(30)
    })

    it('should update correctly state property nameOfPlayerBeingEdited when player edited', () => {
      let nameOfPlayerBeingEdited;
      const expectedName = 'some-name';

      appShallowWrapper.instance().editPlayer(expectedName);

      nameOfPlayerBeingEdited = appShallowWrapper.state().nameOfPlayerBeingEdited;
      
      expect(nameOfPlayerBeingEdited).toEqual(expectedName);
      appShallowWrapper.instance().editPlayer(expectedName);

      nameOfPlayerBeingEdited = appShallowWrapper.state().nameOfPlayerBeingEdited;
      expect(nameOfPlayerBeingEdited).toEqual(null);
    })

    it('should update player and selectedKeys state properties when a player is removed', () => {
      const expectedSelectedKeys = ["DA", "DK", "DQ", "DJ", "DT", "SA", "SK", "SQ", "SJ", "ST"];
      appShallowWrapper.setState({
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
          },
          {
            name: 'Tom',
            suits: ['M'],
            values: ["2", "K", "Q", "4", "T"],
            keys: ["M2", "MK", "MQ", "M4", "MT"]
          },
        ],
        selectedKeys: [
          "DA", "DK", "DQ", "DJ", "DT", "SA", "SK", "SQ", "SJ", "ST", "M2", "MK", "MQ", "M4", "MT"
        ],
        nameOfPlayerBeingEdited: null
      })

      appShallowWrapper.instance().removePlayer('Tom');

      const selectedKeysUpdated = appShallowWrapper.state().selectedKeys;
      const playerNames = appShallowWrapper.state().players.map(player => player.name);

      expect(selectedKeysUpdated).toEqual(expectedSelectedKeys)
      expect(playerNames).toEqual(['Ilias', 'Germain'])
    })

    it('should not remove player and update state when the number of players is 2', () => {
      const expectedSelectedKeys = ["DA", "DK", "DQ", "DJ", "DT", "SA", "SK", "SQ", "SJ", "ST"];

      appShallowWrapper.instance().removePlayer('Ilias');

      const selectedKeysUpdated = appShallowWrapper.state().selectedKeys;
      const playerNames = appShallowWrapper.state().players.map(player => player.name);

      expect(selectedKeysUpdated).toEqual(expectedSelectedKeys)
      expect(playerNames).toEqual(['Ilias', 'Germain'])
    })

    it('should call find the winner when findTheWinner button is clicked', () => {
      const findTheWinnerSpy = sandbox.spy(appShallowWrapper.instance(), 'findTheWinner');
      appShallowWrapper.find(Button).at(1).simulate('click');
      expect(findTheWinnerSpy).toHaveProperty('callCount', 1);
    })

    it('should return the winner when every player has 5 cards on hand', () => {
      sandbox.stub(poker, 'judgeWinner').returns(0);
      const expectedWinnerName = appShallowWrapper.state().players[0].name;
      const winnerName = appShallowWrapper.instance().findTheWinner();
      expect(winnerName).toEqual(expectedWinnerName);
    })

    it('should show alert and not return the winner when any player has less than 5 cards on hand', () => {
      appShallowWrapper.setState({
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
            values: ["A", "K", "Q"],
            keys: ["SA", "SK", "SQ"]
          }
        ],
        selectedKeys: [
          "DA", "DK", "DQ", "DJ", "DT", "SA", "SK", "SQ"
        ],
        nameOfPlayerBeingEdited: null
      })
      const winnerName = appShallowWrapper.instance().findTheWinner();
      expect(winnerName).toEqual(undefined);
    })
  })
})