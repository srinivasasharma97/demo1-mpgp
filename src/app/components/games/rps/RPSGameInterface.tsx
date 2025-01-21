"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  IMovesData,
  movesArray,
  MovesEnum,
  WinnerStateEnum,
} from "./RPSConfig";
import { DRAW_CLASS_NAME, getComputerValue, getWinner } from "./RPSUtil";
import RPSDisplayImage from "./RPSDisplayImage";
import { Button } from "@/components/ui/button";

const RPSGameInterface = () => {
  // states
  const [gameMoves, setGameMoves] = useState<IMovesData[]>([]);
  const [currentMove, setCurrentMove] = useState<IMovesData | null>(null);

  // funcs - handlers
  const handleUserOption = (move: MovesEnum) => {
    const moveId = uuidv4();
    const other = getComputerValue();
    const payload = {
      moveId,
      user: move,
      other,
    };
    const winner = getWinner(payload);
    setCurrentMove({ ...payload, winner });
    setGameMoves((prev) => [...prev, { ...payload, winner }]);
  };

  const handleReplay = () => {
    setCurrentMove(null);
  };

  const handleRestart = () => {
    setCurrentMove(null);
    setGameMoves([]);
  };

  // funcs - render
  const displayHistoryItem = (move: IMovesData) => (
    <div
      className="rps-history-header flex justify-between items-center gap-2 mb-1"
      key={move.moveId}
    >
      <div
        className={`header-cell basis-1/3 text-center border p-2 rounded-md  ${move?.winner?.userClassName}`}
      >
        <RPSDisplayImage className="mx-auto" move={move.user} size={30} />
      </div>
      <div
        className={`header-cell basis-1/3 text-center border p-2 rounded-md ${move?.winner?.otherClassName}`}
      >
        <RPSDisplayImage className="mx-auto" move={move.other} size={30} />
      </div>
      <div
        className={`header-cell basis-1/3 text-center border p-2 rounded-md capitalize ${DRAW_CLASS_NAME}`}
      >
        {move?.winner?.winnerState}
      </div>
    </div>
  );

  return (
    <div className="p-5">
      <h1 className="text-3xl semi-bold mb-5">Rock Paper Scissors</h1>
      <div className="rps-game-interface w-full h-full flex gap-5">
        <div className="rps-participants w-full h-full">
          <div className="rps-participants-move-area w-full h-full flex gap-5 mb-5">
            <div
              className={`user-move-container w-full h-[75vh] flex flex-col gap-2 border-4 p-3 rounded-sm ${currentMove?.winner?.userClassName}`}
            >
              <div className="user-move-title text-xl mb-2">Current User</div>
              <div className="user-move flex-1 flex justify-center items-center p-2 mb-2">
                {currentMove?.user ? (
                  <RPSDisplayImage move={currentMove?.user} size="45%" />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div
              className={`other-move-container w-full h-[75vh] flex flex-col gap-2 border-4 p-3 rounded-sm ${currentMove?.winner?.otherClassName}`}
            >
              <div className="other-move-title text-xl mb-2">Computer</div>
              <div className="other-move flex-1 flex justify-center items-center p-2 mb-2">
                {currentMove?.other ? (
                  <RPSDisplayImage move={currentMove?.other} size="45%" />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          <div className="user-move-options flex flex-wrap justify-start items-center mb-2 gap-5">
            {movesArray?.map((option) => (
              <div
                className={`move-option bg-slate-800 hover:shadow-lg hover:bg-slate-700 rounded-full border border-slate-700 hover:border-slate-600 p-3 flex justify-center items-center`}
                key={option}
                onClick={() => handleUserOption(option)}
              >
                <RPSDisplayImage move={option} size={35} />
              </div>
            ))}
            {currentMove ? (
              <Button
                variant="secondary"
                className="ml-auto"
                onClick={handleReplay}
              >
                Play Again
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        {gameMoves?.length ? (
          <div className="rps-game-history w-[25vw] flex flex-col gap-2 border rounded-sm">
            <div className="rps-history-header flex justify-between items-start gap-2 p-2">
              <div className="rps-history-title text-xl">Game History</div>
              <Button onClick={handleRestart}>Restart</Button>
            </div>
            <div className="rps-history-table flex-1 p-2 border">
              <div className="rps-history-table-header flex justify-between items-center gap-2 border rounded-md mb-1 bg-slate-950">
                <div className="header-cell basis-1/3 text-center p-2 border-r">
                  User
                </div>
                <div className="header-cell basis-1/3 text-center p-2">
                  Other
                </div>
                <div className="header-cell basis-1/3 text-center p-2 border-l">
                  Result
                </div>
              </div>
              <div className="rps-history-table-body h-[50vh] overflow-auto">
                {gameMoves?.reverse()?.map((move) => displayHistoryItem(move))}
              </div>
            </div>
            <div className="rps-stats p-2 flex flex-wrap justify-between items-end gap-2">
              <div className="title underline">Stats: </div>
              <div className="user bg-teal-900 flex-1 px-2 py-1 rounded-sm flex flex-col items-center gap-1">
                <div className="heading text-xs">User</div>
                <div className="value text-md semi-bold truncate">
                  {gameMoves?.filter(
                    (each) => each?.winner?.winnerState === WinnerStateEnum.USER
                  )?.length ?? 0}
                </div>
              </div>
              <div className="other bg-rose-900 flex-1 px-2 py-1 rounded-sm flex flex-col items-center gap-1">
                <div className="heading text-xs">Other</div>
                <div className="value text-md semi-bold truncate">
                  {gameMoves?.filter(
                    (each) =>
                      each?.winner?.winnerState === WinnerStateEnum.OTHER
                  )?.length ?? 0}
                </div>
              </div>
              <div className="draw bg-neutral-900 flex-1  px-2 py-1 rounded-sm flex flex-col items-center gap-1">
                <div className="heading text-xs">Draw</div>
                <div className="value text-md semi-bold truncate">
                  {gameMoves?.filter(
                    (each) => each?.winner?.winnerState === WinnerStateEnum.DRAW
                  )?.length ?? 0}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default RPSGameInterface;
