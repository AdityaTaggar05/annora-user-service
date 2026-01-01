import express from "express";
import routes from "./routes";

export const createApp = ()=> {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/",routes)

    return app;
}
