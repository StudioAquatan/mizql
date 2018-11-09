const sendRequest = async (method, path, data) => {
  let options = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = Object.assign(options.headers, {'Authorization': `JWT ${token}`});
  }
  if (method === "POST") {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(process.env.REACT_APP_API_PATH + path, options);
  return await res.json()
};

export const login = (username, password) => sendRequest("POST", "/auth/jwt/create", {
  username: username,
  password: password
});

// area
export const getArea = (lat, lng, isDemo, date) => {
  if(isDemo){
    return sendRequest("GET", "/demo-area/", {lat: lat, lon: lng, date: date});
  }
  return sendRequest("GET", `/area/?lat=${lat}&lon=${lng}`);
};

// shelters
export const getShelters = (lat, lng, distance, isDemo) => {
  if(isDemo){
    return sendRequest("GET", `/demo-shelters/?lat=${lat}&lon=${lng}&distance=${distance}`);
  }
  return sendRequest("GET", `/shelters/?lat=${lat}&lon=${lng}&distance=${distance}`);
};
export const getShelter = (id, isDemo) => {
  if(isDemo) {
    return sendRequest("GET", `/demo-shelters/${id}/`, {});
  }
  return sendRequest("GET", `/shelters/${id}/`, {});
};
export const getShelterHistory = (shelterId, isDemo) => {
  if(isDemo){
    return sendRequest("GET", `/demo-shelters/${shelterId}/history/`);
  }
  return sendRequest("GET", `/shelters/${shelterId}/history/`);
};
export const postEvacuate = (shelterId, isEvacuate) => sendRequest("POST", `/shelters/${shelterId}/evacuate/`, {is_evacuated: isEvacuate});

// users
export const getUserInfo = () => sendRequest("GET", "/users/me/", {});