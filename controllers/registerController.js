const usersDB = {
  users: require("../model/users"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleRegister = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // check for data duplicates
  const duplicate = usersDB.users.find(
    (person) => person.username === username
  );
  if (duplicate)
    return res.status(409).json({ message: "Username already exists" });
  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // store the new user in the database
    const newUser = { username, password: hashedPassword };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleRegister };
