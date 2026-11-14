export interface CollectionRecord {
  id: number;
  title: string;
}

export interface QuestionRecord {
  id: number;
  content: string;
  collectionId?: number;
}

export interface AnswerRecord {
  id: number;
  content: string;
  points: number | string;
  questionId?: number;
}

export interface WithDataValues<T> {
  dataValues: T;
}

export type TeamSide = "RED" | "BLUE";

export interface TeamColorPayload {
  teamColor: TeamSide;
}

export interface FamiliadaApi {
  onDisplayQuestion: (callback: (question: string) => void) => () => void;
  onDisplayQuestionMain: (
    callback: (content: string, first: boolean, last: boolean) => void
  ) => () => void;
  onDisplayAnswer: (
    callback: (value: string, idAnswer: number, index: number) => void
  ) => () => void;
  onDisplayHiddenAnswer: (
    callback: (index: number, idAnswer: number) => void
  ) => () => void;
  onDisplayPointsForQuestion: (callback: (points: number) => void) => () => void;
  onWrongAnswer: (callback: (team: string) => void) => () => void;
  onStatsTeam: (
    callback: (
      redName: string,
      blueName: string,
      redPoints: number,
      bluePoints: number
    ) => void
  ) => () => void;
  onExposeAnswerOnBoard: (
    callback: (answer: string, idAnswer: number, points?: number) => void
  ) => () => void;
  onUpdateAnswers: (callback: () => void) => () => void;
  getCollections: () => Promise<WithDataValues<CollectionRecord>[]>;
  getQuestions: () => Promise<WithDataValues<QuestionRecord>[] | undefined>;
  getQuestion: (id: number) => Promise<WithDataValues<QuestionRecord>>;
  getAnswers: (id: number) => Promise<WithDataValues<AnswerRecord>[]>;
  getCollectionTitle: () => Promise<
    WithDataValues<CollectionRecord> | CollectionRecord | null | undefined
  >;
  deleteCollection: (id: string | number) => Promise<unknown>;
  setGameData: (
    team1: string,
    team2: string,
    questionsId: number[]
  ) => Promise<boolean>;
  saveCollection: (title: string) => Promise<WithDataValues<CollectionRecord>>;
  updateQuestion: (
    id: number,
    questionContent: string,
    answersContent: string[],
    answersPoints: Array<number | string>
  ) => Promise<boolean>;
  addNewQuestion: (
    question: string,
    answers: string[],
    points: Array<number | string>
  ) => Promise<unknown>;
  setCurrentCollection: (id: string | number) => Promise<unknown>;
  deleteQuestion: (id: number) => Promise<unknown>;
  startGame: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  exposeAnswer: (id: number) => void;
  guessAnswer: (id: number) => void;
  wrongAnswer: (team: TeamColorPayload) => void;
  win: (team: TeamSide) => void;
  deleteCurrentCollection: () => void;
}

declare global {
  interface Window {
    api: FamiliadaApi;
  }
}

export {};
