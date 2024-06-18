const SetOfQuestions = require('../models/setOfQuestions');

async function getSetOfQuestions() {
    return await SetOfQuestions.findAll();
}

async function saveSetOfQuestions(setOfQuestions) {
    return await SetOfQuestions.create(setOfQuestions);
}