import List from '@/typings/list';
import { kickStartBoardAPI } from '..';

export const resetCards = async function (this: any) {
  await kickStartBoardAPI.delete('/api/cards');
  this.activeCard = {};
  this.cardModule = false;
  this.lists.forEach((list: List) => {
    list.cards = [];
  });
  this.showNotification('All cards were deleted', false);
};
