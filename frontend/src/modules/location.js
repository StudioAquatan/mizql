export const GetPosition = () => {
  return new Promise((resolve, reject) => {
    if(!navigator.geolocation) {
      reject("このブラウザは現在地の取得に対応していません:(");
    }

    navigator.geolocation.getCurrentPosition(position => resolve({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }), e => reject(`エラー(${e.code}): ${e.message}`));
  });
};
