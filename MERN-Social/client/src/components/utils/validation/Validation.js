export const isEmptry = value => {
  if (!value) return true;
  return false;
};

export const isEmail = email => {
// eslint-disable-next-line
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(email);
};

export const isLength = password => {
    if (password.length < 6) return true;
    return false;
};

export const isMatch = (password, cf_password) => {
    if (password === cf_password) return true;
    return false;
};