import Card from '@/typings/card';
import List from '@/typings/list';
import { kickStartBoardAPI } from '..';

export const putCard = async function (this: any, card: Card, changes: Partial<Card>) {
  const { id } = card;
  await kickStartBoardAPI.put(`/api/cards/${id}`, changes).then((res) => {
    let listIndex = this.lists.findIndex((list: List) => list.id === card.listId);
    const cardsInList = this.lists[listIndex].cards;
    const patchedCardIndex: number = cardsInList.findIndex((c: Card) => c.id === id);
    this.lists[listIndex].cards[patchedCardIndex] = res.data;
    this.activeCard = res.data;
  });
  if (changes.hasOwnProperty('name')) {
    this.showNotification('Card was renamed', false);
  }
  if (changes.hasOwnProperty('description')) {
    this.showNotification('Description was changed', false);
  }
};
