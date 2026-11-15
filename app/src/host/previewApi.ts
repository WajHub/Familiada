import type {
  AnswerRecord,
  CollectionRecord,
  ConsoleAnswer,
  FamiliadaApi,
  QuestionRecord,
  TeamColorPayload,
  TeamSide,
  WithDataValues,
} from "../types/window";

interface PreviewQuestion extends QuestionRecord {
  collectionId: number;
  order: number;
}

interface PreviewAnswer extends AnswerRecord {
  questionId: number;
  points: number;
}

function model<T>(data: T): WithDataValues<T> {
  return { dataValues: data };
}

function createPreviewApi(): FamiliadaApi {
  let nextId = 80;
  const collections: CollectionRecord[] = [
    { id: 1, title: "Wedding set" },
    { id: 2, title: "Office party" },
    { id: 3, title: "Family night" },
    { id: 4, title: "New Year's Eve" },
  ];
  const questions: PreviewQuestion[] = [
    { id: 4, content: "Name something guests forget to bring to a wedding", collectionId: 1, order: 0 },
    { id: 5, content: "Name a song people dance to at a reception", collectionId: 1, order: 1 },
    { id: 6, content: "Name something you find on a wedding cake", collectionId: 1, order: 2 },
    { id: 7, content: "Name a reason people cry at weddings", collectionId: 1, order: 3 },
    { id: 8, content: "Name something you find in a kitchen at work", collectionId: 2, order: 0 },
    { id: 9, content: "Name something people do instead of working", collectionId: 2, order: 1 },
    { id: 10, content: "Name a snack you steal from the office kitchen", collectionId: 2, order: 2 },
    { id: 11, content: "Name something you hear in a meeting", collectionId: 2, order: 3 },
    { id: 12, content: "Name something families argue about at dinner", collectionId: 3, order: 0 },
    { id: 13, content: "Name a board game people play at home", collectionId: 3, order: 1 },
    { id: 14, content: "Name something kids hide from their parents", collectionId: 3, order: 2 },
    { id: 15, content: "Name a New Year's resolution people break first", collectionId: 4, order: 0 },
    { id: 16, content: "Name something you hear at midnight on New Year's", collectionId: 4, order: 1 },
    { id: 17, content: "Name a drink people pour at a New Year's party", collectionId: 4, order: 2 },
  ];
  const answers: PreviewAnswer[] = [
    { id: 20, content: "Gift", points: 32, questionId: 4 },
    { id: 21, content: "Invitation", points: 24, questionId: 4 },
    { id: 22, content: "Cash", points: 18, questionId: 4 },
    { id: 23, content: "Dancing shoes", points: 11, questionId: 4 },
    { id: 24, content: "Camera", points: 8, questionId: 4 },
    { id: 25, content: "YMCA", points: 28, questionId: 5 },
    { id: 26, content: "Macarena", points: 21, questionId: 5 },
    { id: 27, content: "Cha Cha Slide", points: 16, questionId: 5 },
    { id: 28, content: "Dancing Queen", points: 12, questionId: 5 },
    { id: 29, content: "Figures", points: 30, questionId: 6 },
    { id: 30, content: "Flowers", points: 22, questionId: 6 },
    { id: 31, content: "Icing", points: 18, questionId: 6 },
    { id: 32, content: "Topper", points: 14, questionId: 6 },
    { id: 33, content: "Vows", points: 36, questionId: 7 },
    { id: 34, content: "Speech", points: 25, questionId: 7 },
    { id: 35, content: "First look", points: 17, questionId: 7 },
    { id: 36, content: "Parents", points: 10, questionId: 7 },
    { id: 37, content: "Coffee", points: 40, questionId: 8 },
    { id: 38, content: "Mug", points: 22, questionId: 8 },
    { id: 39, content: "Microwave", points: 14, questionId: 8 },
    { id: 40, content: "Fridge", points: 11, questionId: 8 },
    { id: 41, content: "Check email", points: 31, questionId: 9 },
    { id: 42, content: "Scroll phone", points: 26, questionId: 9 },
    { id: 43, content: "Chat", points: 19, questionId: 9 },
    { id: 44, content: "Make coffee", points: 12, questionId: 9 },
    { id: 45, content: "Biscuits", points: 29, questionId: 10 },
    { id: 46, content: "Chocolate", points: 23, questionId: 10 },
    { id: 47, content: "Yogurt", points: 16, questionId: 10 },
    { id: 48, content: "Fruit", points: 9, questionId: 10 },
    { id: 49, content: "Let's take this offline", points: 34, questionId: 11 },
    { id: 50, content: "Synergy", points: 21, questionId: 11 },
    { id: 51, content: "Action items", points: 18, questionId: 11 },
    { id: 52, content: "Any other business", points: 8, questionId: 11 },
    { id: 53, content: "Politics", points: 33, questionId: 12 },
    { id: 54, content: "Who cooks", points: 21, questionId: 12 },
    { id: 55, content: "TV volume", points: 17, questionId: 12 },
    { id: 56, content: "Who does dishes", points: 14, questionId: 12 },
    { id: 57, content: "Monopoly", points: 27, questionId: 13 },
    { id: 58, content: "Uno", points: 24, questionId: 13 },
    { id: 59, content: "Scrabble", points: 18, questionId: 13 },
    { id: 60, content: "Chess", points: 11, questionId: 13 },
    { id: 61, content: "Phone", points: 38, questionId: 14 },
    { id: 62, content: "Diary", points: 20, questionId: 14 },
    { id: 63, content: "Sweets", points: 16, questionId: 14 },
    { id: 64, content: "Grades", points: 9, questionId: 14 },
    { id: 65, content: "Gym", points: 41, questionId: 15 },
    { id: 66, content: "Diet", points: 27, questionId: 15 },
    { id: 67, content: "Quit smoking", points: 15, questionId: 15 },
    { id: 68, content: "Save money", points: 8, questionId: 15 },
    { id: 69, content: "Happy New Year", points: 44, questionId: 16 },
    { id: 70, content: "Countdown", points: 22, questionId: 16 },
    { id: 71, content: "Fireworks", points: 17, questionId: 16 },
    { id: 72, content: "Kiss", points: 9, questionId: 16 },
    { id: 73, content: "Champagne", points: 48, questionId: 17 },
    { id: 74, content: "Wine", points: 19, questionId: 17 },
    { id: 75, content: "Beer", points: 14, questionId: 17 },
    { id: 76, content: "Whisky", points: 7, questionId: 17 },
  ];

  const extraTopics = [
    "a beach holiday",
    "a first date",
    "a road trip",
    "a job interview",
    "a rainy Sunday",
    "a school reunion",
    "a camping trip",
    "a birthday party",
    "a football match",
    "a long-haul flight",
    "a supermarket",
    "a dentist visit",
    "a Christmas dinner",
    "a gym class",
    "a night out",
    "a baby shower",
    "a house move",
    "a barbecue",
    "a train delay",
    "a video call",
  ];
  const extraAnswers = ["Phone", "Keys", "Wallet", "Jacket", "Coffee"];

  extraTopics.forEach((topic, topicIndex) => {
    const collectionId = 5 + topicIndex;
    collections.push({ id: collectionId, title: `Set: ${topic}` });
    for (let questionIndex = 0; questionIndex < 8; questionIndex += 1) {
      const questionId = 200 + topicIndex * 10 + questionIndex;
      questions.push({
        id: questionId,
        content: `Name something people take to ${topic} (${questionIndex + 1})`,
        collectionId,
        order: questionIndex,
      });
      extraAnswers.forEach((content, answerIndex) => {
        answers.push({
          id: 1000 + topicIndex * 50 + questionIndex * 5 + answerIndex,
          content,
          points: 40 - answerIndex * 7,
          questionId,
        });
      });
    }
  });

  for (let index = 0; index < 18; index += 1) {
    const questionId = 400 + index;
    questions.push({
      id: questionId,
      content: `Name something you hear at a wedding (${index + 1})`,
      collectionId: 1,
      order: 4 + index,
    });
    extraAnswers.forEach((content, answerIndex) => {
      answers.push({
        id: 2000 + index * 5 + answerIndex,
        content,
        points: 36 - answerIndex * 6,
        questionId,
      });
    });
  }
  nextId = 3000;

  let currentCollectionId: number | null = null;
  let roundIds: number[] = [];
  let roundIndex = 0;
  let roundPoints = 0;
  let redName = "Red";
  let blueName = "Blue";
  let redPoints = 0;
  let bluePoints = 0;
  let gameIdle = true;

  const questionListeners = new Set<(content: string, first: boolean, last: boolean, roundPoints?: number, isRoundWon?: boolean) => void>();
  const answerListeners = new Set<(value: string, idAnswer: number, index: number) => void>();
  const pointListeners = new Set<(points: number) => void>();
  const teamListeners = new Set<
    (red: string, blue: string, redScore: number, blueScore: number) => void
  >();
  const updateListeners = new Set<() => void>();
  const lostChancesListeners = new Set<(red: number, blue: number) => void>();
  const syncRoundAnswersListeners = new Set<(answers: ConsoleAnswer[]) => void>();
  const syncBoardAnswersListeners = new Set<(answers: ConsoleAnswer[]) => void>();
  const undoRedoListeners = new Set<(canUndo: boolean, canRedo: boolean) => void>();
  let redLostChances = 0;
  let blueLostChances = 0;
  let previewBoardWindow: Window | null = null;
  const boardStateListeners = new Set<(isOpen: boolean) => void>();

  const publishRound = () => {
    const question = questions.find((item) => item.id === roundIds[roundIndex]);
    const lastIndex = Math.max(roundIds.length - 1, 0);
    roundPoints = 0;
    redLostChances = 0;
    blueLostChances = 0;
    questionListeners.forEach((listener) =>
      listener(question?.content ?? "", roundIndex === 0, roundIndex === lastIndex, roundPoints, false)
    );
    pointListeners.forEach((listener) => listener(0));
    teamListeners.forEach((listener) => listener(redName, blueName, redPoints, bluePoints));
    lostChancesListeners.forEach((listener) => listener(redLostChances, blueLostChances));
    const ranked = answers
      .filter((answer) => answer.questionId === question?.id)
      .sort((left, right) => right.points - left.points);
    ranked.forEach((answer, index) => {
      answerListeners.forEach((listener) => listener(answer.content, answer.id, index + 1));
    });
    const roundAnswers: ConsoleAnswer[] = ranked.map((a, idx) => ({
      id: a.id,
      content: a.content,
      points: a.points,
      index: idx + 1,
      status: "hidden",
    }));
    syncRoundAnswersListeners.forEach((listener) => listener(roundAnswers));
    syncBoardAnswersListeners.forEach((listener) => listener(roundAnswers));
  };

  return {
    onDisplayQuestion: () => () => undefined,
    onDisplayQuestionMain: (callback) => {
      questionListeners.add(callback);
      return () => questionListeners.delete(callback);
    },
    onDisplayAnswer: (callback) => {
      answerListeners.add(callback);
      return () => answerListeners.delete(callback);
    },
    onDisplayHiddenAnswer: () => () => undefined,
    onDisplayPointsForQuestion: (callback) => {
      pointListeners.add(callback);
      return () => pointListeners.delete(callback);
    },
    onWrongAnswer: () => () => undefined,
    onDisplayLostChances: (callback) => {
      lostChancesListeners.add(callback);
      return () => lostChancesListeners.delete(callback);
    },
    onSyncRoundAnswers: (callback) => {
      syncRoundAnswersListeners.add(callback);
      return () => syncRoundAnswersListeners.delete(callback);
    },
    onSyncBoardAnswers: (callback) => {
      syncBoardAnswersListeners.add(callback);
      return () => syncBoardAnswersListeners.delete(callback);
    },
    onStatsTeam: (callback) => {
      teamListeners.add(callback);
      return () => teamListeners.delete(callback);
    },
    onExposeAnswerOnBoard: () => () => undefined,
    onUpdateAnswers: (callback) => {
      updateListeners.add(callback);
      return () => updateListeners.delete(callback);
    },
    onBoardWindowState: (callback) => {
      boardStateListeners.add(callback);
      return () => boardStateListeners.delete(callback);
    },
    onUndoRedoState: (callback) => {
      undoRedoListeners.add(callback);
      return () => undoRedoListeners.delete(callback);
    },
    undoGameAction: () => undefined,
    redoGameAction: () => undefined,
    getCollections: async () => collections.map((collection) => model(collection)),
    getQuestions: async () =>
      questions
        .filter((question) => question.collectionId === currentCollectionId)
        .sort((left, right) => left.order - right.order)
        .map((question) => model(question)),
    getQuestion: async (id) => {
      const question = questions.find((item) => item.id === id);
      return model(question ?? { id, content: "" });
    },
    getAnswers: async (id) =>
      answers.filter((answer) => answer.questionId === id).map((answer) => model(answer)),
    getCollectionTitle: async () => {
      const collection = collections.find((item) => item.id === currentCollectionId);
      return collection ? model(collection) : null;
    },
    deleteCollection: async (id) => {
      const numericId = Number(id);
      const questionIds = questions
        .filter((question) => question.collectionId === numericId)
        .map((question) => question.id);
      for (let index = answers.length - 1; index >= 0; index -= 1) {
        const answer = answers[index];
        if (answer && questionIds.includes(answer.questionId)) {
          answers.splice(index, 1);
        }
      }
      for (let index = questions.length - 1; index >= 0; index -= 1) {
        if (questions[index]?.collectionId === numericId) {
          questions.splice(index, 1);
        }
      }
      const collectionIndex = collections.findIndex((collection) => collection.id === numericId);
      if (collectionIndex >= 0) {
        collections.splice(collectionIndex, 1);
      }
    },
    setGameData: async (team1, team2, questionsId) => {
      redName = team1;
      blueName = team2;
      redPoints = 0;
      bluePoints = 0;
      roundIds = questionsId;
      roundIndex = 0;
      roundPoints = 0;
      gameIdle = true;
      return true;
    },
    saveCollection: async (title) => {
      const created = { id: nextId, title };
      nextId += 1;
      collections.push(created);
      return model(created);
    },
    updateCollection: async (id, title) => {
      const numericId = Number(id);
      const collection = collections.find((item) => item.id === numericId);
      if (collection) {
        collection.title = title;
      }
      return true;
    },
    updateQuestion: async (id, questionContent, answersContent, answersPoints) => {
      const question = questions.find((item) => item.id === id);
      if (question) {
        question.content = questionContent;
      }
      for (let index = answers.length - 1; index >= 0; index -= 1) {
        if (answers[index]?.questionId === id) {
          answers.splice(index, 1);
        }
      }
      answersContent.forEach((content, index) => {
        const points = Number(answersPoints[index] ?? 0);
        answers.push({
          id: nextId,
          content,
          points: Number.isFinite(points) ? points : 0,
          questionId: id,
        });
        nextId += 1;
      });
      updateListeners.forEach((listener) => listener());
      return true;
    },
    addNewQuestion: async (question, answerContents, points) => {
      const id = nextId;
      nextId += 1;
      const targetCollectionId = currentCollectionId ?? collections[0]?.id ?? 1;
      const existingCount = questions.filter(
        (item) => item.collectionId === targetCollectionId
      ).length;
      questions.push({
        id,
        content: question,
        collectionId: targetCollectionId,
        order: existingCount,
      });
      answerContents.forEach((content, index) => {
        const value = Number(points[index] ?? 0);
        answers.push({
          id: nextId,
          content,
          points: Number.isFinite(value) ? value : 0,
          questionId: id,
        });
        nextId += 1;
      });
      return id;
    },
    reorderQuestions: async (questionIds) => {
      questionIds.forEach((id, index) => {
        const question = questions.find((item) => item.id === id);
        if (question) {
          question.order = index;
        }
      });
      return true;
    },
    setCurrentCollection: async (id) => {
      currentCollectionId = Number(id);
    },
    deleteQuestion: async (id) => {
      const index = questions.findIndex((question) => question.id === id);
      if (index >= 0) {
        questions.splice(index, 1);
      }
      for (let answerIndex = answers.length - 1; answerIndex >= 0; answerIndex -= 1) {
        if (answers[answerIndex]?.questionId === id) {
          answers.splice(answerIndex, 1);
        }
      }
    },
    startGame: () => {
      if (!gameIdle) {
        return;
      }
      gameIdle = false;
      publishRound();
    },
    nextQuestion: () => {
      if (roundIndex >= roundIds.length - 1) {
        return;
      }
      roundIndex += 1;
      publishRound();
    },
    prevQuestion: () => {
      if (roundIndex <= 0) {
        return;
      }
      roundIndex -= 1;
      publishRound();
    },
    exposeAnswer: () => undefined,
    guessAnswer: (id) => {
      const answer = answers.find((item) => item.id === id);
      roundPoints += answer?.points ?? 0;
      pointListeners.forEach((listener) => listener(roundPoints));
    },
    wrongAnswer: (team?: TeamColorPayload) => {
      if (team && team.teamColor === "RED") {
        redLostChances = Math.min(3, redLostChances + 1);
      } else {
        blueLostChances = Math.min(3, blueLostChances + 1);
      }
      lostChancesListeners.forEach((listener) =>
        listener(redLostChances, blueLostChances)
      );
    },
    win: (team: TeamSide) => {
      if (team === "RED") {
        redPoints += roundPoints;
      } else {
        bluePoints += roundPoints;
      }
      teamListeners.forEach((listener) => listener(redName, blueName, redPoints, bluePoints));
    },
    deleteCurrentCollection: () => {
      gameIdle = true;
      roundIds = [];
      roundIndex = 0;
      roundPoints = 0;
    },
    isGameActive: async () => !gameIdle,
    isBoardOpen: async () => Boolean(previewBoardWindow && !previewBoardWindow.closed),
    openBoardWindow: async () => {
      if (previewBoardWindow && !previewBoardWindow.closed) {
        previewBoardWindow.focus();
      } else {
        previewBoardWindow = window.open("#/BoardPanel", "_blank", "width=800,height=600");
        boardStateListeners.forEach((listener) => listener(true));
      }
      return true;
    },
  };
}

export function installPreviewApi(): void {
  if (typeof window.api !== "undefined") {
    return;
  }
  window.api = createPreviewApi();
  window.__familiadaPreview = true;
}
