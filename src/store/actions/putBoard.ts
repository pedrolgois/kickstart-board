import Board from '@/typings/board';
import { kickStartBoardAPI } from '..';

export const putBoard = async function (this: any, board: Board, payload: object) {
  const patchedBoard = await kickStartBoardAPI.put(`/api/boards/${board.id}`, payload);
  const boardIndex = this.boardList.all.findIndex((board: Board) => board.id === board.id);
  this.board = patchedBoard.data;
  this.boardList.all[boardIndex] = patchedBoard.data;
};
