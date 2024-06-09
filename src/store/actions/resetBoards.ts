import { kickStartBoardAPI } from '..';

export const resetBoards = async function (this: any) {
  kickStartBoardAPI
    .delete('/api/boards')
    .then(() => {
      this.activeCard = {};
      this.board = {};
      this.boardList.all = [];
      this.cardModule = false;
      this.lists = [];
      this.showNotification('All boards were deleted', false);
    })
    .catch((e) => {
      console.log(e);
      this.showNotification('Boards could not be deleted', true);
    });
};
