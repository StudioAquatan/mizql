export const getPosition = () => {
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

export const canGetPosition = () => {
  return navigator.geolocation;
};

export const getGoogleMapRouteLink = (from, to) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=walking`
};