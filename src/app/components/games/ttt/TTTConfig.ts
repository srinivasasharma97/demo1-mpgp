export const SIZE = 3;

export enum PlayerOptionsEnum {
  X = "X",
  O = "O",
}

export enum PlayerEnum {
  USER = "user",
  PLAYER = "player",
}

export interface IPlayerOptions {
  user: PlayerOptionsEnum;
  player: PlayerOptionsEnum;
}

export interface IWinnerDetails {
  winner: PlayerEnum;
  indexes: number[];
}

export interface IGameMove {
  moveId: string;
  move: PlayerOptionsEnum;
  player: PlayerEnum;
  index: number;
  history: (PlayerOptionsEnum | null)[];
}

export interface IGameHistoryItem {
  gameId: string;
  moves: IGameMove[];
  winner?: IWinnerDetails | null;
  draw?: boolean;
}
