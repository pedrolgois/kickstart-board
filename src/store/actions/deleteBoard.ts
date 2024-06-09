import Board from '@/typings/board';
import { kickStartBoardAPI } from '..';

export const deleteBoard = async function (this: any, boardId: Board['id']) {
  kickStartBoardAPI
    .delete(`/api/boards/${boardId}`)
    .then(() => {
      this.showNotification('Board was deleted', false);
    })
    .catch((e) => {
      this.showNotification('Board could not be deleted', true);
    });
};
