// gameSession.js - In-memory game state and Command Pattern implementation

class Command {
  execute(session) {}
  undo(session) {}
}

class GuessAnswerCommand extends Command {
  constructor(answerId) {
    super();
    this.answerId = answerId;
    this.prevStatus = null;
    this.addedPoints = 0;
    this.roundIndex = null;
  }

  execute(session) {
    if (this.roundIndex === null) {
      this.roundIndex = session.currentIndex;
    }
    session.currentIndex = this.roundIndex;
    const round = session.rounds[this.roundIndex];
    if (!round) return;

    const answer = round.answers.find((a) => a.id === this.answerId);
    if (!answer || answer.status !== "hidden") return;

    this.prevStatus = answer.status;
    this.addedPoints = Number(answer.points) || 0;
    answer.status = "guessed";
    round.roundPoints += this.addedPoints;
  }

  undo(session) {
    if (this.roundIndex === null) return;
    session.currentIndex = this.roundIndex;
    const round = session.rounds[this.roundIndex];
    if (!round) return;

    const answer = round.answers.find((a) => a.id === this.answerId);
    if (!answer) return;

    answer.status = this.prevStatus || "hidden";
    round.roundPoints = Math.max(0, round.roundPoints - this.addedPoints);
  }
}

class ExposeAnswerCommand extends Command {
  constructor(answerId) {
    super();
    this.answerId = answerId;
    this.prevStatus = null;
    this.roundIndex = null;
  }

  execute(session) {
    if (this.roundIndex === null) {
      this.roundIndex = session.currentIndex;
    }
    session.currentIndex = this.roundIndex;
    const round = session.rounds[this.roundIndex];
    if (!round) return;

    const answer = round.answers.find((a) => a.id === this.answerId);
    if (!answer || answer.status !== "hidden") return;

    this.prevStatus = answer.status;
    answer.status = "revealed";
  }

  undo(session) {
    if (this.roundIndex === null) return;
    session.currentIndex = this.roundIndex;
    const round = session.rounds[this.roundIndex];
    if (!round) return;

    const answer = round.answers.find((a) => a.id === this.answerId);
    if (!answer) return;

    answer.status = this.prevStatus || "hidden";
  }
}

class StrikeCommand extends Command {
  constructor(team) {
    super();
    this.team = team === "BLUE" ? "BLUE" : "RED";
    this.roundIndex = null;
    this.didIncrement = false;
  }

  execute(session) {
    if (this.roundIndex === null) {
      this.roundIndex = session.currentIndex;
    }
    session.currentIndex = this.roundIndex;
    const round = session.rounds[this.roundIndex];
    if (!round) return;

    if (round.lostChances[this.team] < 3) {
      round.lostChances[this.team] += 1;
      this.didIncrement = true;
    }
  }

  undo(session) {
    if (this.roundIndex === null) return;
    session.currentIndex = this.roundIndex;
    if (this.didIncrement) {
      const round = session.rounds[this.roundIndex];
      if (!round) return;

      round.lostChances[this.team] = Math.max(
        0,
        round.lostChances[this.team] - 1
      );
    }
  }
}

class AwardRoundCommand extends Command {
  constructor(team) {
    super();
    this.team = team === "BLUE" ? "BLUE" : "RED";
    this.roundIndex = null;
    this.prevWinner = null;
    this.awardedPoints = 0;
  }

  execute(session) {
    if (this.roundIndex === null) {
      this.roundIndex = session.currentIndex;
    }
    session.currentIndex = this.roundIndex;
    const round = session.rounds[this.roundIndex];
    if (!round || round.winner) return; // already awarded

    this.prevWinner = round.winner;
    this.awardedPoints = round.roundPoints;
    round.winner = this.team;
    round.awardedPoints = this.awardedPoints;
    session.teams[this.team].points += this.awardedPoints;
  }

  undo(session) {
    if (this.roundIndex === null) return;
    session.currentIndex = this.roundIndex;
    const round = session.rounds[this.roundIndex];
    if (!round) return;

    if (round.winner === this.team) {
      session.teams[this.team].points = Math.max(
        0,
        session.teams[this.team].points - this.awardedPoints
      );
      round.winner = this.prevWinner;
      round.awardedPoints = 0;
    }
  }
}

class GameSession {
  constructor(team1Name, team2Name, roundsData) {
    this.teams = {
      RED: { name: team1Name || "RED", points: 0 },
      BLUE: { name: team2Name || "BLUE", points: 0 },
    };
    this.currentIndex = 0;
    this.rounds = (roundsData || []).map((data) => ({
      questionId: data.id,
      content: data.content,
      answers: (data.answers || []).map((a, idx) => ({
        id: a.id,
        content: a.content,
        points: Number(a.points) || 0,
        index: idx + 1,
        status: "hidden", // "hidden" | "revealed" | "guessed"
      })),
      roundPoints: 0,
      lostChances: { RED: 0, BLUE: 0 },
      winner: null, // "RED" | "BLUE" | null
      awardedPoints: 0,
    }));
    this.commandHistory = [];
    this.redoStack = [];
  }

  getCurrentRound() {
    return this.rounds[this.currentIndex] || null;
  }

  executeCommand(command) {
    command.execute(this);
    this.commandHistory.push(command);
    this.redoStack = [];
  }

  undo() {
    const cmd = this.commandHistory.pop();
    if (cmd) {
      cmd.undo(this);
      this.redoStack.push(cmd);
    }
  }

  redo() {
    const cmd = this.redoStack.pop();
    if (cmd) {
      cmd.execute(this);
      this.commandHistory.push(cmd);
    }
  }

  canUndo() {
    return this.commandHistory.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  navigate(direction) {
    const nextIndex = Math.max(
      0,
      Math.min(this.rounds.length - 1, this.currentIndex + direction)
    );
    this.currentIndex = nextIndex;
    return this.currentIndex;
  }
}

module.exports = {
  Command,
  GuessAnswerCommand,
  ExposeAnswerCommand,
  StrikeCommand,
  AwardRoundCommand,
  GameSession,
};
