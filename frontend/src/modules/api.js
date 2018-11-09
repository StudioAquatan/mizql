const sendRequest = async (method, path, data) => {
  const options = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `JWT ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(process.env.REACT_APP_API_PATH + path, options);
  return await res.json()
};

export const login = (username, password) => sendRequest("POST", "/auth/jwt/create", {username: username, password: password});

// area
export const getArea = (lat, lng) => sendRequest("GET", "/area/", {lat: lat, lon: lng});
export const getDemoArea = (lat, lng, date) => sendRequest("GET", "/demo-area/", {lat: lat, lon: lng, date: date});

// shelters
export const getShelters = (lat, lng, distance) => sendRequest("GET", "/shelters/", {lat: lat, lon: lng, distance: distance});
export const getShelter = (id) => sendRequest("GET", `/shelters/${id}`, {});
export const postEvacuate = (shelterId, isEvacuate) => sendRequest("POST", `/shelters/${shelterId}/evacuate/`, {is_evacuated: isEvacuate});
export const getShelterHistory = (shelterId) => sendRequest("GET", `/shelters/${shelterId}/history/`, {});

// users
export const getUserInfo = () => sendRequest("GET", "/users/me/", {});