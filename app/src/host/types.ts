import type { AnswerRecord, QuestionRecord, WithDataValues } from "../types/window";

export interface CollectionSummary {
  id: number;
  title: string;
}

export interface QuestionListItem {
  id: number;
  content: string;
}

export interface AnswerSummary {
  id: number;
  content: string;
  points: number;
}

export interface AnswerDraft {
  id: string | number;
  content: string;
  points: number;
}

export interface RevealedAnswer {
  id: number;
  content: string;
  index: number;
}

function unwrap<T>(row: WithDataValues<T> | T): T {
  if (typeof row === "object" && row !== null && "dataValues" in row) {
    return row.dataValues;
  }
  return row;
}

function toPoints(points: number | string): number {
  const parsed = typeof points === "number" ? points : Number(points);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toCollectionSummary(
  row: WithDataValues<{ id: number; title: string }>
): CollectionSummary {
  const data = unwrap(row);
  return { id: data.id, title: data.title };
}

export function toQuestionListItem(
  row: WithDataValues<QuestionRecord> | QuestionRecord
): QuestionListItem {
  const data = unwrap(row);
  return { id: data.id, content: data.content };
}

export function toAnswerSummary(
  row: WithDataValues<AnswerRecord> | AnswerRecord
): AnswerSummary {
  const data = unwrap(row);
  return {
    id: data.id,
    content: data.content,
    points: toPoints(data.points),
  };
}
