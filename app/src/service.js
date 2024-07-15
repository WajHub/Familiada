const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');
const Answer = require('../models/answer')(sequelize, DataTypes);
const Question = require('../models/question')(sequelize, DataTypes);
const Collection = require('../models/collection')(sequelize, DataTypes);
// const gameLogic = require('./gameLogic');


// Getters
async function getCollections() {
  return await Collection.findAll();
}

async function getCollection(id) {
  return await Collection.findOne({
    where: {
      id: id
    }
  });
}

async function getAnswer(id){
  return await Answer.findOne({
    where: {
      id: id
    }
  });
}

async function getAnswers(event, id) {
  return await Answer.findAll({
    where: {
      questionId: id
    }
  });
}


async function getQuestions(idCollection) {
  return await Question.findAll({
    where: {
      collectionId: idCollection
    }
  });
}

async function getQuestion(id){
  return await Question.findOne({
    where: {
      id: id
    }
  });
}

// Insertion
async function saveCollection(event, title) {
  Collection.create({ title: title })
    .then(set => {
      console.log("Set created: ", set);
    })
    .catch(error => console.error("Error creating set: ", error));
}

async function saveQuestion(question, collectionId){
  const createdQuestion = await Question.create({
    content: question,
    collectionId: collectionId
  });
  return createdQuestion.id;
}

async function saveAnswer(answer, points, questionId){
  Answer.create({
    content: answer,
    points: points,
    questionId: questionId
  });
}


async function saveNewQuestion(question, answers, points) {
  Question.create({
    content: question,
    collectionId: setOfQuestions.id
  });
  Question.findOne({
    where:{
      content: question
    }
  }).then(questionRespone => {
    for (i=0; i<answers.length; i++){
      Answer.create({
        content: answers[i],
        points: points[i],
        questionId: questionRespone.id
      });
    }
  });
}

// Deletion
async function deleteCollection(event, id) {
  console.log("Deleting set with id: ", id);
  await Collection.destroy({
    where: {
      id: id
    }
  });
}




module.exports = {
  getCollections,
  getCollection,
  getQuestions,
  getQuestion,
  getAnswers,
  getAnswer,
  getCollection,
  saveCollection,
  saveQuestion,
  saveAnswer,
  saveNewQuestion,
  deleteCollection
};