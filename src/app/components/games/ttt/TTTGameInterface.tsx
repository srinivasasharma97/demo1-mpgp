"use client";

import { Circle, Terminal, X } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  IGameHistoryItem,
  IGameMove,
  IPlayerOptions,
  IWinnerDetails,
  PlayerEnum,
  PlayerOptionsEnum,
  SIZE,
} from "./TTTConfig";
import {
  checkAllIndexes,
  checkMinNValues,
  getAllDiagonalIndexes,
  getAllXYIndexes,
  getDefaultBoard,
  getNotNullCount,
  getOppPlayer,
  getOppPlayerOption,
} from "./TTTUtils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const DIAGONAL_INDEXES = getAllDiagonalIndexes(SIZE);
const DEFAULT_BOARD = getDefaultBoard(SIZE);

const TTTGameInterface = () => {
  // states
  const [playerOptions, setPlayerOptions] = useState<IPlayerOptions | null>(
    null
  );
  const [currentPlayer, setCurrentPlayer] = useState<PlayerEnum | null>(null);
  const [gameBoard, setGameBoard] =
    useState<(PlayerOptionsEnum | null)[]>(DEFAULT_BOARD);
  const [playerMoves, setPlayerMoves] = useState<IGameMove[]>([]);
  const [winnerDetails, setWinnerDetails] = useState<IWinnerDetails | null>(
    null
  );
  const [gameHistory, setGameHistory] = useState<IGameHistoryItem[]>([]);
  const [gameSelected, setGameSelected] = useState<IGameHistoryItem | null>(
    null
  );

  // funcs - hanlders
  const handlePlayerOptions = (option: PlayerOptionsEnum) => {
    setPlayerOptions({
      user: option,
      player:
        option === PlayerOptionsEnum.X
          ? PlayerOptionsEnum.O
          : PlayerOptionsEnum.X,
    });
    setCurrentPlayer(
      option === PlayerOptionsEnum.X ? PlayerEnum.USER : PlayerEnum.PLAYER
    );
  };

  const checkWinnerCells = (
    board: (PlayerOptionsEnum | null)[],
    indexes: number[],
    move: PlayerOptionsEnum
  ) => {
    const win = checkAllIndexes(board, indexes, move);
    if (win && currentPlayer)
      setWinnerDetails({
        winner: currentPlayer,
        indexes,
      });
  };

  const checkWinner = (
    newBoard: (PlayerOptionsEnum | null)[],
    index: number,
    move: PlayerOptionsEnum
  ) => {
    const { left, right } = DIAGONAL_INDEXES;

    if (left?.includes(index)) {
      checkWinnerCells(newBoard, left, move);
    }
    if (right?.includes(index)) {
      checkWinnerCells(newBoard, right, move);
    }
    const { x, y } = getAllXYIndexes(SIZE, index);
    checkWinnerCells(newBoard, x, move);
    checkWinnerCells(newBoard, y, move);
  };

  const handleNewGame = () => {
    if (!gameSelected) {
      const payload = {
        gameId: uuidv4(),
        moves: playerMoves,
        winner: winnerDetails,
        draw: !winnerDetails?.winner && checkMinNValues(gameBoard, SIZE * SIZE),
      };
      setGameHistory((prev) => [...prev, payload]);
    }
    setPlayerOptions(null);
    setCurrentPlayer(null);
    setGameBoard(getDefaultBoard(SIZE));
    setPlayerMoves([]);
    setWinnerDetails(null);
    setGameSelected(null);
  };

  const hanldeTileClick = (index: number) => {
    if (!currentPlayer) return;
    const move = playerOptions?.[currentPlayer];

    if (!move) return;

    const newBoard = new Array(...gameBoard);
    newBoard[index] = move;
    setGameBoard(newBoard);

    const notNullCount = getNotNullCount(newBoard);

    const payload = {
      moveId: uuidv4(),
      move,
      player: currentPlayer,
      index,
      history: newBoard,
    };

    if (notNullCount > (playerMoves?.length ?? 0)) {
      setPlayerMoves((prev) => [...prev, payload]);
    } else {
      setPlayerMoves((prev) => [...prev.slice(0, notNullCount - 1), payload]);
    }

    setCurrentPlayer(
      currentPlayer === PlayerEnum.USER ? PlayerEnum.PLAYER : PlayerEnum.USER
    );

    if (notNullCount >= 2 * SIZE - 1) checkWinner(newBoard, index, move);
  };

  const handleMoveClick = (move: IGameMove) => {
    setCurrentPlayer(
      move.player === PlayerEnum.USER ? PlayerEnum.PLAYER : PlayerEnum.USER
    );
    setGameBoard(move.history);
  };

  const handleGameClick = (game: IGameHistoryItem) => {
    const lastMove = game?.moves?.[game?.moves?.length - 1];
    setPlayerOptions({
      user:
        lastMove?.player === PlayerEnum.USER
          ? lastMove?.move
          : getOppPlayerOption(lastMove?.move),
      player:
        lastMove?.player === PlayerEnum.PLAYER
          ? lastMove?.move
          : getOppPlayerOption(lastMove?.move),
    });
    setCurrentPlayer(getOppPlayer(lastMove?.player));
    setGameBoard(lastMove?.history);
    setPlayerMoves(game?.moves);
    setWinnerDetails(game?.winner ?? null);
    setGameSelected(game);
  };

  // funcs - render
  const getTileValue = (value: PlayerOptionsEnum, size?: number) => {
    const bg = value === PlayerOptionsEnum?.X ? "bg-rose-900" : "bg-indigo-900";
    return (
      <div
        className={`gi-option-x border text-center rounded-md ${bg} ${
          size && size > 50 ? "p-2" : "p-1"
        }`}
      >
        {value === PlayerOptionsEnum?.X ? (
          <X size={size ?? 25} className="m-auto" />
        ) : (
          <Circle size={size ?? 25} className="m-auto" />
        )}
      </div>
    );
  };

  const renderTile = (index: number, value: PlayerOptionsEnum | null) => (
    <div
      className={`render-tile border-2 size-[100px] text-center p-2 ${
        winnerDetails?.indexes?.includes(index)
          ? "border-emerald-500 bg-emerald-950"
          : ""
      }`}
      key={index}
      onClick={() => !value && hanldeTileClick(index)}
    >
      {value ? getTileValue(value, 60) : <></>}
    </div>
  );

  return (
    <div className="ttt-game-container p-5 w-full h-full">
      <div className="ttt-game-title text-3xl semi-bold mb-5">Tic-Tac-Toe</div>

      <div className="ttt-game-body flex flex-wrap w-full h-full gap-5">
        <div className="ttt-game-interface border-2 rounded-md h-full min-h-[75vh]  flex-1">
          <div className="ttt-gi-header flex justify-between gap-2 border-b p-3">
            <div className="user-option flex justify-start items-center gap-2">
              <div className="text-lg">User</div>
              {playerOptions?.user ? getTileValue(playerOptions?.user) : <></>}
              {currentPlayer === PlayerEnum?.USER ? (
                <Badge>Active</Badge>
              ) : (
                <></>
              )}
            </div>
            <div className="player-option flex justify-end items-center gap-2">
              {currentPlayer === PlayerEnum?.PLAYER ? (
                <Badge>Active</Badge>
              ) : (
                <></>
              )}
              {playerOptions?.player ? (
                getTileValue(playerOptions?.player)
              ) : (
                <></>
              )}
              <div className="text-lg">Player</div>
            </div>
          </div>
          <div className="ttt-gi-content">
            {playerOptions ? (
              <div className="ttt-game-render-container flex justify-center items-center p-5">
                <div className={`ttt-game-render grid grid-cols-${SIZE}`}>
                  {gameBoard?.map((each, index) => renderTile(index, each))}
                </div>
              </div>
            ) : (
              <div className="ttt-gi-options-selection w-full flex flex-col items-center gap-5 p-5">
                <div className="ttt-gi-options-selection-header text-xl m-5">
                  Please select of the the below to start the game.
                </div>
                <div className="ttt-gi-options w-full flex-1 flex justify-center items-center gap-5 mb-5">
                  <div
                    className="gi-option-x border rounded-md bg-rose-900 p-5"
                    onClick={() => handlePlayerOptions(PlayerOptionsEnum.X)}
                  >
                    <X size={200} />
                  </div>
                  <div
                    className="gi-option-o border rounded-md bg-indigo-900 p-5"
                    onClick={() => handlePlayerOptions(PlayerOptionsEnum.O)}
                  >
                    <Circle size={200} />
                  </div>
                </div>
              </div>
            )}

            {!winnerDetails?.winner &&
            checkMinNValues(gameBoard, SIZE * SIZE) ? (
              <div className="winner-alert p-5">
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Sorry!</AlertTitle>
                  <AlertDescription>
                    Out of moves. Do you wan to play again?{" "}
                    <span>
                      <Button
                        className="rounded-full text-[.75rem] mx-2"
                        variant="outline"
                        onClick={handleNewGame}
                      >
                        Play Again
                      </Button>
                    </span>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <></>
            )}

            {winnerDetails?.winner ? (
              <div className="winner-alert p-5">
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>We have a winner!</AlertTitle>
                  <AlertDescription>
                    <span className="capitalize font-bold">
                      {currentPlayer}
                    </span>{" "}
                    has won the game. Do you wan to play again?{" "}
                    <span>
                      <Button
                        className="rounded-full text-[.75rem] mx-2"
                        variant="outline"
                        onClick={handleNewGame}
                      >
                        Play Again
                      </Button>
                    </span>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="ttt-game-history-container min-h-[75vh] ">
          {playerMoves?.length ? (
            <div className="ttt-game-moves border rounded-md w-full md:w-[25vw] mb-5">
              <div className="ttt-game-moves-title border-b p-2 text-xl">
                Player Moves
              </div>
              <div className="ttt-game-moves-container p-2 max-h-[30vh] overflow-auto">
                {playerMoves?.reverse()?.map((move, index) => (
                  <div
                    className="ttt-game-moves-item flex justify-between items-center p-2 border rounded-md mb-2"
                    key={move.moveId}
                    onClick={() => handleMoveClick(move)}
                  >
                    <div className="ttt-game-moves-item-player capitalize">
                      {index + 1}: {move.player}
                    </div>
                    <div className="ttt-game-moves-item-move">
                      {getTileValue(move.move)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
          {gameHistory?.length ? (
            <div className="ttt-games-history border-2 rounded-md w-full md:w-[25vw]">
              <div className="ttt-game-history-title  border-b p-2 text-xl">
                Game History
              </div>
              <div className="ttt-game-history-container  p-2 max-h-[30vh] overflow-auto">
                {gameHistory?.reverse()?.map((game) => (
                  <div
                    className={`ttt-game-history-item flex justify-between items-center p-2 border rounded-md mb-2 ${
                      gameSelected?.gameId === game.gameId
                        ? "border-indigo-700 bg-indigo-950"
                        : ""
                    }`}
                    key={game.gameId}
                    onClick={() => handleGameClick(game)}
                  >
                    <div className="ttt-ghi-winner capitalize">
                      {game?.winner?.winner ?? "Draw"}
                    </div>
                    <div className="ttt-ghi-moves">
                      {game?.moves?.length ?? 0} moves
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default TTTGameInterface;
