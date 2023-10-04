const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
// const nodemailer = require("nodemailer");

const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

dotenv.config();
const PORT = process.env.PORT || 8000;

// custom middlware logger
app.use(logger);

// custome middleware credentials
app.use(credentials);
// CORS = Cross Origin Resource Sharing
app.use(cors(corsOptions));
// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware to handle json data
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built-in middleware to handle static files
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//    user: "",
//    pass: ""
//   },
// });

// const mailOptions = {
//   from: "fujidoja@gmail.com",
//   to: "sulav.pokhrel25@gmail.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) console.log(error);
//   else console.log("Email sent: " + info.response);
// });
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html"))
    res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json")) res.json({ error: "404 Not Found" });
  else res.type("text").send("404 Not Found");
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
