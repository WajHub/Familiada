import {
  toAnswerSummary,
  toCollectionSummary,
  toQuestionListItem,
  type AnswerSummary,
  type CollectionSummary,
  type QuestionListItem,
} from "./types";

export async function fetchCollections(): Promise<CollectionSummary[]> {
  const rows = await window.api.getCollections();
  return rows.map((row) => toCollectionSummary(row));
}

export async function fetchQuestions(): Promise<QuestionListItem[]> {
  const rows = await window.api.get_questions();
  if (!rows) {
    return [];
  }
  return rows.map((row) => toQuestionListItem(row));
}

export async function fetchAnswers(questionId: number): Promise<AnswerSummary[]> {
  const rows = await window.api.get_answers(questionId);
  return rows.map((row) => toAnswerSummary(row));
}

export async function fetchQuestion(questionId: number): Promise<QuestionListItem> {
  const row = await window.api.getQuestions(questionId);
  return toQuestionListItem(row);
}
