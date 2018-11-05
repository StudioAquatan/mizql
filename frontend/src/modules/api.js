export const login = async (username, password) => {
  const options = {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  };

  const res = await fetch(`${process.env.REACT_APP_API_PATH}/auth/jwt/create/`, options);
  return await res.json()
};
