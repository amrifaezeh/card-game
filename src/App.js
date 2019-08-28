// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
 
// class App extends Component {
//   render() {
//     return React.createElement(
//         'div',
//         null,
//         'Welcome to React',
//     )
//   }
// }
 
// export default App;
import React from 'react';
import propTypes from 'prop-types';
import { isNumeric } from '../../Helper';
import './playingcard.js';

const cardSuites = {
  D: 'diamonds',
  S: 'spades',
  H: 'hearts',
  C: 'clubs',
};

const cardCourts = {
  K: 'king',
  J: 'jack',
  Q: 'queen',
  A: 'ace',
  T: '10',
};

const cardValues = {
  ace: '14',
  king: '13',
  queen: '12',
  jack: '11',
};

const PlayingCard = ({ cardSymbol }) => {
  const url = convertCardSymbolToUrl(cardSymbol);
  return <img alt="playing-card" className="playing-card" src={url} />;
};

PlayingCard.propTypes = { cardSymbol: propTypes.string.isRequired };

export const convertCardSymbolToUrl = cardSymbol => `/cards/${getCardCourt(cardSymbol)}_of_${getCardSuite(cardSymbol)}.svg`;

export const getCardSuite = cardSymbol => cardSuites[cardSymbol[1]];

export const getCardCourt = cardSymbol => {
  const courtSymbol = cardSymbol[0];
  if (isNumeric(courtSymbol)) {
    return String(courtSymbol);
  }
  return String(cardCourts[courtSymbol]);
};

export const getCardValue = cardCourt => {
  if (isNumeric(cardCourt)) {
    return Number(cardCourt);
  }
  return Number(cardValues[cardCourt]);
};

export default PlayingCard;
