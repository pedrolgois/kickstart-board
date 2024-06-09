import Card from '@/typings/card';
import { kickStartBoardAPI } from '..';

export const uploadFile = async function (this: any, card: Card, acceptFile: File) {
  const reader = new FileReader();
  const object = this;
  let base64data;
  reader.readAsDataURL(acceptFile);
  reader.onloadend = function() {
    base64data = reader.result;
    kickStartBoardAPI.put(`/api/cards/${card.id}`, {image: `name=${acceptFile.name}&value=${base64data}`}).then((({data})=>{
      object.activeCard = data;
      object.showNotification('File was sucessfully uploaded', false);
    })).catch((e) => {
      object.showNotification('There was an error uploading file', true);
    })
  }

  // const formData = new FormData();
  // const file = acceptFile;
  // const { id } = card;
  // file && formData.append('image', file);
  // axios
  //   .post(`/api/upload?card=${id}`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })
  //   .then((upload) => {
  //     this.showNotification('File was sucessfully uploaded', false);
  //     this.activeCard = upload.data;
  //   })
  //   .catch(() => {
  //     this.showNotification('There was an error uploading file', true);
  //   });
};
