export const enum MovesEnum {
  ROCK = "rock",
  PAPPER = "papper",
  SCISSORS = "scissors",
}

export interface IWinnerModel {
  winnerState: WinnerStateEnum;
  userClassName: string;
  otherClassName: string;
}

export interface IMovesData {
  moveId: string;
  user: MovesEnum;
  other: MovesEnum;
  winner?: IWinnerModel | null;
}

// Todo: replace with Enum Iteration
export const movesArray = [
  MovesEnum.ROCK,
  MovesEnum.PAPPER,
  MovesEnum.SCISSORS,
];

export const counterMoves = {
  [MovesEnum.ROCK]: MovesEnum.PAPPER,
  [MovesEnum.PAPPER]: MovesEnum.SCISSORS,
  [MovesEnum.SCISSORS]: MovesEnum.ROCK,
};

export const enum WinnerStateEnum {
  USER = "user",
  OTHER = "other",
  DRAW = "draw",
}
