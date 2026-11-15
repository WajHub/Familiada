import correctAnswerResource from "../../audio/CorrectAnswer.mp3";
import showAnswerResource from "../../audio/ShowAnswer.mp3";
import startRoundResource from "../../audio/StartRound.mp3";
import wrongAnswerResource from "../../audio/WrongAnswer.mp3";

export const startRoundSound = new Audio(startRoundResource);
export const correctAnswerSound = new Audio(correctAnswerResource);
export const wrongAnswerSound = new Audio(wrongAnswerResource);
export const showAnswerSound = new Audio(showAnswerResource);

export function playSound(sound: HTMLAudioElement): void {
  sound.currentTime = 0;
  void sound.play().catch(() => undefined);
}
