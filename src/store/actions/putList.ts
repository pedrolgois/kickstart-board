import List from '@/typings/list';
import { kickStartBoardAPI } from '..';

export const putList = async function (this: any, list: List, changes: Partial<List>) {
  const { id } = list;
  await kickStartBoardAPI.put(`/api/lists/${id}`, changes).then(({ data }) => {
    const patchedListIndex: number = this.lists.findIndex((c: List) => c.id === id);
    data.cards = this.lists[patchedListIndex].cards;
    this.lists[patchedListIndex] = data;
  }).catch((e)=>{
    console.error(e)
  });
  changes.hasOwnProperty('name') && this.showNotification('List was renamed', false);
};
