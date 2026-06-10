import dotenv from "dotenv";
dotenv.config();
import app from "./app";

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}.
        link: http://localhost:${PORT}`);
});
