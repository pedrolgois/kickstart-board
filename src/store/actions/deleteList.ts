import List from '@/typings/list';
import { kickStartBoardAPI } from '..';

export const deleteList = async function (this: any, listId: List['id']) {
  await kickStartBoardAPI.delete(`/api/boards/1/lists/${listId}`);
  this.lists = this.lists.filter((item: List) => item.id !== listId);
  this.sortLists();
};
