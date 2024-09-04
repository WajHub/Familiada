// gameLogic.js
const Service = require("./service");
const Team = require("../models/team");

var collection;
var questions = [];
var teamRED;
var teamBLUE;

async function setCurrentCollection(event, id) {
  Service.getCollection(id).then((set) => {
    collection = set;
  });
}

async function getQuestions() {
  console.log("GETTING QUESTIONS");
  console.log(questions);
  return questions;
}

async function setGameData(team1, team2, questionsId) {
  teamRED = new Team(team1, 0);
  teamBLUE = new Team(team2, 0);
  console.log("questionsId", questionsId);
  for (i = 0; i < questionsId.length; i++) {
    await Service.getQuestion(questionsId[i]).then((question) => {
      questions.push(question);
      console.log("QUESTION ADDING", question);
    });
  }
}

async function addNewQuestion(event, question, answers, points) {
  const questionid = await Service.saveQuestion(question, collection.id);
  for (i = 0; i < answers.length; i++) {
    Service.saveAnswer(answers[i], points[i], questionid);
  }
}

function clearData() {
  questions = [];
}

module.exports = {
  getQuestions,
  getCollectionTitle: () => {
    return collection;
  },
  getCollectionId: () => {
    return collection.id;
  },
  getTeamRed: () => teamRED.name,
  getTeamBlue: () => teamBLUE.name,
  getRedPoints: () => teamRED.points,
  getBluePoints: () => teamBLUE.points,
  addNewQuestion,
  addPointsToRed: (points) => teamRED.addPoints(points),
  addPointsToBlue: (points) => teamBLUE.addPoints(points),
  setCurrentCollection,
  setGameData,
  clearData,
};
