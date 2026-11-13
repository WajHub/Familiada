// gameLogic.js
const Service = require("./service");
const Team = require("./entities/team");

let collection = null;
let questions = [];
let teamRED = new Team("RED", 0);
let teamBLUE = new Team("BLUE", 0);

async function setCurrentCollection(eventOrId, maybeId) {
  const id = maybeId !== undefined ? maybeId : eventOrId;
  collection = await Service.getCollection(id);
  return collection;
}

async function getQuestions() {
  return questions;
}

async function setGameData(team1, team2, questionsId) {
  teamRED = new Team(team1 || "RED", 0);
  teamBLUE = new Team(team2 || "BLUE", 0);
  questions = [];
  if (Array.isArray(questionsId)) {
    for (let i = 0; i < questionsId.length; i++) {
      const question = await Service.getQuestion(questionsId[i]);
      if (question) {
        questions.push(question);
      }
    }
  }
}

async function addNewQuestion(arg1, arg2, arg3, arg4) {
  // Support both (event, question, answers, points) and (question, answers, points)
  let question, answers, points;
  if (arg4 !== undefined) {
    question = arg2;
    answers = arg3;
    points = arg4;
  } else {
    question = arg1;
    answers = arg2;
    points = arg3;
  }

  if (!collection || !collection.id) {
    throw new Error("No active collection selected");
  }

  const questionId = await Service.saveQuestion(question, collection.id);
  if (Array.isArray(answers) && Array.isArray(points)) {
    for (let i = 0; i < answers.length; i++) {
      await Service.saveAnswer(answers[i], points[i], questionId);
    }
  }
  return questionId;
}

function clearData() {
  questions = [];
}

module.exports = {
  getQuestions,
  getCollectionTitle: () => collection,
  getCollectionId: () => (collection ? collection.id : null),
  getTeamRed: () => (teamRED ? teamRED.name : "RED"),
  getTeamBlue: () => (teamBLUE ? teamBLUE.name : "BLUE"),
  getRedPoints: () => (teamRED ? teamRED.points : 0),
  getBluePoints: () => (teamBLUE ? teamBLUE.points : 0),
  addNewQuestion,
  addPointsToRed: (points) => {
    if (teamRED) teamRED.addPoints(points);
  },
  addPointsToBlue: (points) => {
    if (teamBLUE) teamBLUE.addPoints(points);
  },
  setCurrentCollection,
  setGameData,
  clearData,
};
