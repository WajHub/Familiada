// gameLogic.js
const Service = require('./service');
const Team = require('../models/team');


var collection;
var questions = [];
var teamRED;
var teamBLUE;

async function setCurrentCollection(event, id) {
    collection = await Service.getCollection(id);
}

async function getQuestions(){
    return questions; 
}

function setGameData(event, team1, team2, questionsId) {
    teamRED = new Team(team1, 0);
    teamBLUE = new Team(team2, 0);
    for(i=0; i<questionsId.length; i++){
        Service.getQuestion(questionsId[i]).then((question) => {
            console.log("Question:", question);
            questions.push(question);
        });
    }
}

async function addNewQuestion(event, question, answers, points){
    const questionid = await Service.saveQuestion(question, collection.id);
    for(i=0; i<answers.length; i++){
        Service.saveAnswer(answers[i], points[i], questionid);
    }
}

function clearData(){
var collection;
var questions = [];
var teamRED;
var teamBLUE;
}



module.exports = {
    getQuestions,
    getCollectionTitle: () => collection.title,
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
    clearData
};