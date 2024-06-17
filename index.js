const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const port = 3000;

app.use(express.json()); // Parse incoming requests as JSON
const users = [];
app.get("/users", (req, res) => {
  res.json(users); // Send users as JSON response
});

app.post("/user", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      password: hashedPassword,
    };
    users.push(user);
    res.status(200).json(user); // Send user as JSON response
  } catch {
    res.status(400).json({ message: "Invalid user" }); // Send error as JSON response
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const user = users.find((user) => user.name === req.body.name);
    if (!user) {
      return res.status(400).send("Cannot find user");
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (passwordMatch) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
