const { Answer, Question, Collection, sequelize } = require("../models");

// Getters
async function getCollections() {
  return await Collection.findAll();
}

async function getCollection(eventOrId, maybeId) {
  const id = maybeId !== undefined ? maybeId : eventOrId;
  return await Collection.findOne({
    where: {
      id: id,
    },
  });
}

async function getAnswer(id) {
  return await Answer.findOne({
    where: {
      id: id,
    },
  });
}

async function getAnswers(eventOrId, maybeId) {
  const idQuestion = maybeId !== undefined ? maybeId : eventOrId;
  return await Answer.findAll({
    where: {
      questionId: idQuestion,
    },
  });
}

async function getQuestions(eventOrId, maybeId) {
  const idCollection = maybeId !== undefined ? maybeId : eventOrId;
  return await Question.findAll({
    where: {
      collectionId: idCollection,
    },
    order: [
      ["order", "ASC"],
      ["id", "ASC"],
    ],
  });
}

async function getQuestion(eventOrId, maybeId) {
  const id = maybeId !== undefined ? maybeId : eventOrId;
  return await Question.findOne({
    where: {
      id: id,
    },
  });
}

// Insertion
async function saveCollection(eventOrTitle, maybeTitle) {
  const title = maybeTitle !== undefined ? maybeTitle : eventOrTitle;
  return await Collection.create({ title: title });
}

async function saveQuestion(question, collectionId) {
  const maxOrderQuestion = await Question.findOne({
    where: { collectionId: collectionId },
    order: [["order", "DESC"]],
    attributes: ["order"],
  });
  const nextOrder =
    maxOrderQuestion && typeof maxOrderQuestion.order === "number"
      ? maxOrderQuestion.order + 1
      : 0;

  const createdQuestion = await Question.create({
    content: question,
    collectionId: collectionId,
    order: nextOrder,
  });
  return createdQuestion.id;
}

async function saveAnswer(answer, points, questionId) {
  return await Answer.create({
    content: answer,
    points: points,
    questionId: questionId,
  });
}

// Deletion
async function deleteCollection(eventOrId, maybeId) {
  const id = maybeId !== undefined ? maybeId : eventOrId;
  return await sequelize.transaction(async (t) => {
    const questions = await Question.findAll({
      where: { collectionId: id },
      transaction: t,
    });
    const questionIds = questions.map((q) => q.id);
    if (questionIds.length > 0) {
      await Answer.destroy({
        where: { questionId: questionIds },
        transaction: t,
      });
      await Question.destroy({
        where: { id: questionIds },
        transaction: t,
      });
    }
    await Collection.destroy({
      where: { id: id },
      transaction: t,
    });
  });
}

async function deleteQuestion(eventOrId, maybeId) {
  const id = maybeId !== undefined ? maybeId : eventOrId;
  return await sequelize.transaction(async (t) => {
    await Answer.destroy({
      where: {
        questionId: id,
      },
      transaction: t,
    });
    await Question.destroy({
      where: {
        id: id,
      },
      transaction: t,
    });
  });
}

async function deleteAnswers(idQuestion) {
  return await Answer.destroy({
    where: {
      questionId: idQuestion,
    },
  });
}

// Update
async function updateCollection(eventOrId, maybeIdOrTitle, maybeTitle) {
  let id;
  let title;
  if (maybeTitle !== undefined) {
    id = maybeIdOrTitle;
    title = maybeTitle;
  } else {
    id = eventOrId;
    title = maybeIdOrTitle;
  }
  return await Collection.update({ title: title }, { where: { id: id } });
}

async function updateQuestion(arg1, arg2, arg3, arg4, arg5) {
  let id, questionContent, answersContent, answersPoints;
  if (arg5 !== undefined) {
    id = arg2;
    questionContent = arg3;
    answersContent = arg4;
    answersPoints = arg5;
  } else {
    id = arg1;
    questionContent = arg2;
    answersContent = arg3;
    answersPoints = arg4;
  }

  return await sequelize.transaction(async (t) => {
    const question = await Question.findOne({
      where: { id: id },
      transaction: t,
    });
    if (!question) {
      throw new Error("Question not found with id: " + id);
    }
    question.content = questionContent;
    await question.save({ transaction: t });

    await Answer.destroy({
      where: { questionId: id },
      transaction: t,
    });

    if (Array.isArray(answersContent) && Array.isArray(answersPoints)) {
      for (let i = 0; i < answersContent.length; i++) {
        await Answer.create(
          {
            content: answersContent[i],
            points: answersPoints[i],
            questionId: id,
          },
          { transaction: t }
        );
      }
    }
  });
}

async function reorderQuestions(questionIds) {
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    return true;
  }
  return await sequelize.transaction(async (t) => {
    for (let index = 0; index < questionIds.length; index++) {
      await Question.update(
        { order: index },
        {
          where: { id: questionIds[index] },
          transaction: t,
        }
      );
    }
    return true;
  });
}

async function copyCollection(eventOrId, maybeId) {
  const id = maybeId !== undefined ? maybeId : eventOrId;
  return await sequelize.transaction(async (t) => {
    const source = await Collection.findOne({
      where: { id: id },
      transaction: t,
    });
    if (!source) {
      throw new Error("Collection not found with id: " + id);
    }
    const newTitle = `${source.title}-copy`;
    const newCollection = await Collection.create(
      { title: newTitle },
      { transaction: t }
    );
    const questions = await Question.findAll({
      where: { collectionId: id },
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
      transaction: t,
    });
    for (const q of questions) {
      const newQuestion = await Question.create(
        {
          content: q.content,
          collectionId: newCollection.id,
          order: q.order,
        },
        { transaction: t }
      );
      const answers = await Answer.findAll({
        where: { questionId: q.id },
        transaction: t,
      });
      for (const a of answers) {
        await Answer.create(
          {
            content: a.content,
            points: a.points,
            questionId: newQuestion.id,
          },
          { transaction: t }
        );
      }
    }
    return newCollection.get({ plain: true });
  });
}

module.exports = {
  getCollections,
  getCollection,
  getQuestions,
  getQuestion,
  getAnswers,
  getAnswer,
  saveCollection,
  saveQuestion,
  saveAnswer,
  deleteCollection,
  deleteQuestion,
  deleteAnswers,
  updateCollection,
  updateQuestion,
  reorderQuestions,
  copyCollection,
};
