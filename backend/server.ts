import express, { Express } from "express";
import { connectToDatabase }from "./config/conn.js";
import noteRoutes from "./routes/noteRoutes"
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHander.js";
import cors from 'cors'
import { credentials } from "./middleware/credentials.js";
import { corsOptions } from "./config/corsOptions.js";
import envConfig from "./config/envConfig.js";


async function startServer() {
  const port = Number(envConfig.PORT) || 3000;

  await connectToDatabase();
  const app: Express = express();
  
  app.use(credentials);
  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use("/notes", noteRoutes)
  
  app.get("/", (req, res) => {
    res.send("Hello, this is the root endpoint!");
  });
  
  app.use(errorHandler);
  app.use(notFound);
  
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
  })
}

startServer()