const { execSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const SPRINT_BOARD_ID = '5a8d6e6fdb91525b2915ae51';

const getMyBoards = () => {
  return JSON.parse(execSync("curl 'https://api.trello.com/1/members/me/boards?fields=name,url&key=c72616a098005a3ba385b043b8c3fb1e&token=9028c64273d1a66b102dc3b7a7292a225b5ef0dc7396c13ce9903b3e9abeb8ee'", { encoding: 'utf8' }))
};

const getBoard = () => {
  return JSON.parse(
    execSync(
      `curl --request GET --url 'https://api.trello.com/1/boards/${SPRINT_BOARD_ID}?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_APP_TOKEN}' --header 'Accept: application/json'`,
      { encoding: 'utf8' }
    )
  );
}

const getBoardLists = () => {
  return JSON.parse(
    execSync(
      `curl --request GET --url 'https://api.trello.com/1/boards/${SPRINT_BOARD_ID}/lists?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_APP_TOKEN}' --header 'Accept: application/json'`,
      { encoding: 'utf8' }
    )
  );
};

const getLists = (board) => {
  return JSON.parse(execSync("curl --request GET --url 'https://api.trello.com/1/lists/{id}?key=c72616a098005a3ba385b043b8c3fb1e&token=9028c64273d1a66b102dc3b7a7292a225b5ef0dc7396c13ce9903b3e9abeb8ee'", { encoding: 'utf8' }));
}

const getLabelFromBoardId = (boardId) => {
  return JSON.parse(
    execSync(
      `curl -s --request GET --url 'https://api.trello.com/1/boards/${boardId}/labels?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_APP_TOKEN}' --header 'Accept: application/json'`,
      { encoding: 'utf8' }
    )
  );
};



const getCardsFromListId = (listId) => {
  return JSON.parse(
    execSync(
      `curl -s --request GET --url 'https://api.trello.com/1/lists/${listId}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_APP_TOKEN}' --header 'Accept: application/json'`,
      { encoding: 'utf8' }
    )
  );
}

const getCardsFromListIds = (listIds) => {
  let cards = [];

  listIds.forEach(listId => {
    const cardsFromList = getCardsFromListId(listId);
    cards = [...cards, ...cardsFromList];
  });

  return cards;
}

const getMemberFromBoardId = (boardId) => {
  return JSON.parse(
    execSync(
      `curl -s --request GET --url 'https://api.trello.com/1/boards/${boardId}/members?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_APP_TOKEN}' --header 'Accept: application/json'`,
      { encoding: 'utf8' }
    )
  );
}

module.exports = {
  getBoard,
  getBoardLists,
  getCardsFromListId,
  getCardsFromListIds,
  getLabelFromBoardId,
  getLists,
  getMemberFromBoardId,
  getMyBoards,
};
