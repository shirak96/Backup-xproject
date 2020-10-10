import {Router, Request, Response} from "express";
import auth from "./auth";
import admin from "./admin";
import user from "./user";
import donation from "./donation";
import news from "./news";
import newspaper from "./newspaper";
import hero from "./hero";
import sponsor from "./sponsor";
import setting from "./setting";
import graphApi from "./graph-api";
import youtubeVideos from "./youtubeVideos";
import MapCalendar from "./MapCalendar";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
    res.send("Ok");
});
routes.use("/api/v1/auth", auth);
routes.use("/api/v1/admin", admin);
routes.use("/api/v1/user", user);
routes.use("/api/v1/donation", donation);
routes.use("/api/v1/news", news);
routes.use("/api/v1/newspaper", newspaper);
routes.use("/api/v1/hero", hero);
routes.use("/api/v1/sponsor", sponsor);
routes.use("/api/v1/setting", setting);
routes.use("/api/v1/graph-api", graphApi);
routes.use("/api/v1/youtube-videos", youtubeVideos);
routes.use("/api/v1/map-calendar", MapCalendar);

export default routes;
