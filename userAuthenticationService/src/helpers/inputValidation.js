const isEmailValid = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const isPassValid = (pass) => {
  const passRegex =
    /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  return passRegex.test(pass);
};

const isNameValid = (name) => {
  const nameRegex = /^[a-zA-Z]{3,}$/;
  return nameRegex.test(name);
};

module.exports = {
  isEmailValid,
  isPassValid,
  isNameValid,
};
