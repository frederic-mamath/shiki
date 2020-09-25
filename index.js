const dotenv = require('dotenv');
const { pathOr, replace, test } = require('ramda');
const { 
  getBoard,
  getBoardList,
  getCardsFromListId,
  getCardsFromListIds,
  getLabelFromBoardId,
  getLists,
  getMyBoards,
} = require('./services');

dotenv.config();

const SPRINT_BOARD_ID = '5a8d6e6fdb91525b2915ae51';

const trelloKey = process.env.TRELLO_API_KEY;
const trelloToken = process.env.TRELLO_APP_TOKEN;
const sprintBoardId = '5a8d6e6fdb91525b2915ae51';

const listIdsFromCurrentSprint = [
  '5d834cd318d1ff1eb325a1f2', // Spring backlog
  '5aab823872b4665ecea1ed1e', // Daily backlog
  '5a8d6eac532ae08259a2906c', // Doing
  '5a8d6eb016d2d315a8900b66', // Code review
  '5a8d7137e51d5d41f1fb5e7d', // Blocked
  '5a8d6eb6a051da71387d57f9', // To validate
  '5f6388b827815b40476d34ee', // Sprint 129
];

const LABELS = {
  TRANSVERSE: {
    id: '5a94096088d9853655317e99',
    idBoard: '5a8d6e6fdb91525b2915ae51',
    name: 'Transverse',
    color: 'black',
  },
  SPRINT_GOAL: {
    id: '5a990d3ffb932718c20fff01',
    idBoard: '5a8d6e6fdb91525b2915ae51',
    name: 'Sprint Goal',
    color: 'yellow'
  },
  BUG: {
    id: '5ab26655fc402949634fcea9',
    idBoard: '5a8d6e6fdb91525b2915ae51',
    name: 'Bug Fix',
    color: 'orange'
  },
}

const printSeparator = () => {
  console.log("==========");
};

const Card = {
  getNbPoints: (card) => {
    const name = card.name;
    const nbPoints = name.match(/\((\d)*(\.)*(\d)*\)/);

    return pathOr('0', [0], nbPoints);
  },
};

const Cards = {
  getTotalPoints: (cards) => {
    let totalPoints = 0;
  
    cards.forEach(card => {
      let nbPoint = Card.getNbPoints(card);
      nbPoint = replace(/\(|\)/g, '', nbPoint);
      nbPoint = parseFloat(nbPoint);
      totalPoints += nbPoint;
    })
  
    return totalPoints;
  },
};

const printCard = (card) => {
  console.log("- ", card.name);
  console.log("\t-", card.url);
};

const cards = getCardsFromListIds(listIdsFromCurrentSprint);
const sprintGoals = cards.filter(card => card.idLabels.includes(LABELS.SPRINT_GOAL.id))
const investigations = cards.filter(card => test(/.*investigation.*/gmi, card.name));
const transverses = cards.filter(card => card.idLabels.includes(LABELS.TRANSVERSE.id));
const bugs = cards.filter(card => card.idLabels.includes(LABELS.BUG.id));
const others = cards.filter(card => !sprintGoals.includes(card) && !investigations.includes(card) && !transverses.includes(card) && !bugs.includes(card));

const investigationPoints = Cards.getTotalPoints(investigations);
const transversePoints = Cards.getTotalPoints(transverses);
const sprintGoalPoints = Cards.getTotalPoints(sprintGoals);
const bugPoints = Cards.getTotalPoints(bugs);
const otherPoints = Cards.getTotalPoints(others);

console.log("# Sprint 129");
printSeparator();
console.log("Number of points: ", sprintGoalPoints);
sprintGoals.forEach(printCard);
printSeparator();
console.log("Number of points: ", bugPoints);
bugs.forEach(printCard);
printSeparator();
console.log("Number of points: ", otherPoints);
others.forEach(printCard);
printSeparator();
console.log("Number of points: ", investigationPoints);
investigations.forEach(printCard);
printSeparator();
console.log("Number of points: ", transversePoints);
transverses.forEach(printCard);


// console.log(getLabelFromBoardId(sprintBoardId));