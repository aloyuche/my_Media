const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: [true, "The username already exist"],
      required: [true, "Please enter your Username"],
      minlength: 6,
    },
    email: {
      type: String,

      required: true,
    },
    dept: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: [6, "Invalid password, must be more than 6 character"],
    },
  },
  { timestamps: true }
);

// fire a function after doc is saved to db
authSchema.post("save", (doc, next) => {
  console.log("The new user was created and saved", doc);
  next();
});

// fire a function before doc is saved to db
authSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// static method to login

authSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  console.log(user);
  // Here (login) is STATIC method
  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect Username");
};

const userAuth = mongoose.model("userauth", authSchema);
module.exports = userAuth;

//Cart A has product A with primary-key
//cart B see Product A as Foreign Key
