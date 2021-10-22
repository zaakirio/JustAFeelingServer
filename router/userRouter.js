const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Registration
router.post("/", async (req, res) => {
  try {
    const { username, password, passwordVerify } = req.body;

    //Validation
    ///Check all fields for input
    if (!username || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    //Check password length
    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters.",
      });
    //Check passwords match
    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Please enter the same password twice.",
      });
    //Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this username already exists.",
      });

    //Hash password string
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //Save new user to DB
    const newUser = new User({
      username,
      passwordHash,
      date : Date.now()
    });

    const savedUser = await newUser.save();

    //Sign the Token
    const token = jwt.sign({
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    //Send http-only cookie - prevents hijacking via JS
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//Log in
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //Check all fields for input
    if (!username || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    //Vali
    const existingUser = await User.findOne({ username });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong username or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong username or password." });

    //Sign the token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    ); 

    //Send http-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send();
});

router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});

module.exports = router;
