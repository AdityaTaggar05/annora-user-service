import express from "express";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";

export const createApp = ()=> {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(errorMiddleware)
    app.use("/",routes)

    return app;
}
