const validator = require("validator");

const signUpDataValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName ) {
    throw new Error("Please enter a name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong.");
  }
};

const validationDataForEdit = (req) => {
  const allowedFields = ["firstName","lastName","age","skills","about","photoUrl","gender"];
  return Object.keys(req.body).every((key)=> allowedFields.includes(key))
  
}

module.exports = { signUpDataValidation, validationDataForEdit };
