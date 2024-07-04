// gameLogic.js
const Service = require('./service');

var collection;
var teamRED;
var teamBLUE;

async function setCurrentCollection(event, id) {
    collection = await Service.getCollection(id);
}

async function getQuestions(){
    return Service.getQuestions(collection.id); 
}

function setTeams(event, team1, team2) {
    teamRED = team1;
    teamBLUE = team2;
    console.log(team1);
    console.log(team2);
    console.log("Teams set");
}

async function addNewQuestion(event, question, answers, points){
    console.log("ADDING NEW QUESTION");
    console.log(question);
    console.log(answers);
    console.log(points);
    const questionid = await Service.saveQuestion(question, collection.id);
    for(i=0; i<answers.length; i++){
        Service.saveAnswer(answers[i], points[i], questionid);
    }
}


module.exports = {
    getQuestions,
    getCollectionTitle: () => collection.title,
    getCollectionId: () => {
        return collection.id;
    },
    addNewQuestion,
    setCurrentCollection,
    setTeams
};