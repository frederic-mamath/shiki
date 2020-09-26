const dotenv = require('dotenv');
const { pathOr, reduce, replace, test } = require('ramda');
const { 
  getBoard,
  getBoardLists,
  getCardsFromListId,
  getCardsFromListIds,
  getLabelFromBoardId,
  getLists,
  getMemberFromBoardId,
  getMyBoards,
} = require('./services');

dotenv.config();

const REGEX_POINT_ON_CARD = /\((\d)*(\.)*(\d)*\)/;
const SPRINT_BOARD_ID = '5a8d6e6fdb91525b2915ae51';
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

const COLUMNS = {
  TO_VALIDATE: {
    id: '5a8d6eb6a051da71387d57f9',
    name: 'To Validate (add to bottom)',
    closed: false,
    pos: 660887.7942471723,
    softLimit: null,
    idBoard: '5a8d6e6fdb91525b2915ae51',
    subscribed: false
  },
  DONE: { // To be updated weekly
    id: '5f6388b827815b40476d34ee',
    name: 'Done Sprint 129',
    closed: false,
    pos: 665361.9901046376,
    softLimit: null,
    idBoard: '5a8d6e6fdb91525b2915ae51',
    subscribed: false
  },
}

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

const members = getMemberFromBoardId(SPRINT_BOARD_ID);
const membersById = reduce(
  (acc, val) => {    
    acc[val.id] = val;

    return acc;
  },
  {},
  members,
);

const printSeparator = (sectionName) => {
  console.log("".padEnd(20, "="));
  console.log(sectionName.padEnd(20, "="));
  console.log("".padEnd(20, "="));
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

const printCard = (card, options = {
  withUrl: false,
  withMember: false,
}) => {
  if (!card.name.match(REGEX_POINT_ON_CARD)) {
    return;
  }

  if (card.idList === COLUMNS.TO_VALIDATE.id) {
    console.log("\x1b[33m", "- ", card.name, "\x1b[0m");
  } else if (card.idList === COLUMNS.DONE.id) {
    console.log("\x1b[34m", "- ", card.name, "\x1b[0m");
  } else {
    console.log("- ", card.name);
  }

  if (options.withUrl) {
    console.log("\t-", card.url);
  }

  if (options.withMember) {
    const membersOnCard = card.idMembers;
    membersOnCard.forEach(memberId => {
      console.log("\t\t-", pathOr(memberId, [memberId, 'fullName'], membersById));    
    });
  }
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
printSeparator("Sprint Goal");
console.log("Number of points: ", sprintGoalPoints);
sprintGoals.forEach(card => printCard(card));
printSeparator("Bugs");
console.log("Number of points: ", bugPoints);
bugs.forEach(card => printCard(card));
printSeparator("Others");
console.log("Number of points: ", otherPoints);
others.forEach(card => printCard(card));
printSeparator("Investigations");
console.log("Number of points: ", investigationPoints);
investigations.forEach(card => printCard(card));
printSeparator("Transverses");
console.log("Number of points: ", transversePoints);
transverses.forEach(card => printCard(card));


// console.log(getLabelFromBoardId(sprintBoardId));

// console.log(getBoardLists(SPRINT_BOARD_ID))
// console.log(getCardsFromListId('5f6388b827815b40476d34ee'));
// console.log(getMemberFromBoardId(SPRINT_BOARD_ID));