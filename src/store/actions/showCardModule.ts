import Card from '@/typings/card';
import { kickStartBoardAPI } from '..';

export const showCardModule = async function (this: any, cardId: Card['id'], flag: boolean) {
  if (flag) {
    await kickStartBoardAPI
      .get(`/api/cards/${cardId}`)
      .then(({ data }) => {
        console.log(data)
        this.activeCard = data;
        this.cardModule = true;
      })
      .catch(() => {
        this.activeCard = {};
        this.cardModule = false;
        this.showNotification(`Card with id: ${cardId} was not found`, true);
      });
  }
 else {
    this.activeCard = {};
    this.cardModule = false;
  }
};
