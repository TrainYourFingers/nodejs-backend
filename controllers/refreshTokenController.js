const usersDB = {
  users: require("../model/users"),
  setUsers: function (data) {
    this.users = data;
  },
};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.status(401);
  console.log(cookie.jwt);
  const refreshToken = cookie.jwt;

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) return res.status(403).json({ message: "Forbidden" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "45s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
