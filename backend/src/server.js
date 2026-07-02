require("dotenv").config();
console.log(process.env.PORT);
require("./config/db");
require("./config/init");

const app = require("./app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
});