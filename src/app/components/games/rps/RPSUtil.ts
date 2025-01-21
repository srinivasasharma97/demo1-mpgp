import {
  counterMoves,
  IMovesData,
  movesArray,
  WinnerStateEnum,
} from "./RPSConfig";

export const WIN_CLASS_NAME = "border-teal-900";
export const DRAW_CLASS_NAME = "border-neutral-700";
export const LOSE_CLASS_NAME = "border-rose-900";
export const HISTORY_ITEM_CLASS_NAME = "";

export const getComputerValue = () => {
  const randomIndex = Math.floor(Math.random() * movesArray?.length);
  return movesArray?.[randomIndex];
};

export const getWinner = (move: IMovesData) => {
  if (move.user === move.other)
    return {
      winnerState: WinnerStateEnum.DRAW,
      userClassName: DRAW_CLASS_NAME,
      otherClassName: DRAW_CLASS_NAME,
    };

  const userCounterMove = counterMoves?.[move.user];
  if (move.other === userCounterMove)
    return {
      winnerState: WinnerStateEnum.OTHER,
      userClassName: LOSE_CLASS_NAME,
      otherClassName: WIN_CLASS_NAME,
    };
  else
    return {
      winnerState: WinnerStateEnum.USER,
      userClassName: WIN_CLASS_NAME,
      otherClassName: LOSE_CLASS_NAME,
    };
};
