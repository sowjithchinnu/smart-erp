require("dotenv").config();
console.log(process.env.PORT);
require("./config/db");

const app = require("./app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on port ${PORT}`);
});