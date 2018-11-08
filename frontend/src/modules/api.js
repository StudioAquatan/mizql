const sendPost = async (path, data) => {
  const options = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(process.env.REACT_APP_API_PATH + path, options);
  return await res.json()
};

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

export const login = (username, password) => sendPost('/auth/jwt/create', {username, password});
export const getFollowList = () => sendRequest("GET", "/me/", {});