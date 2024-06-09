import { kickStartBoardAPI } from '..';

export const resetLists = async function (this: any) {
  await kickStartBoardAPI.delete('/api/lists');
  this.activeCard = {};
  this.cardModule = false;
  this.lists = [];
  this.showNotification('All lists were deleted', false);
};
