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



module.exports = {
    getQuestions,
    getCollectionTitle: () => collection.title,
    setCurrentCollection,
    setTeams
};