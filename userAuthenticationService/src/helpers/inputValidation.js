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

const hasValue = (...values) => {
  if (values.length == 0) {
    return false;
  }
  for (const value of values) {
    if (typeof value === "object" && value !== null) {
      if (Object.keys(value).length === 0) {
        return false;
      }
    }
    if (
      value == "" ||
      value == null ||
      value == undefined ||
      value.toString().trim() == ""
    ) {
      return false;
    }
    return true;
  }
};

module.exports = {
  isEmailValid,
  isPassValid,
  isNameValid,
  hasValue,
};
