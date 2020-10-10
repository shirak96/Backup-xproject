import {Router} from "express";
import YoutubeVideoController from "../controllers/YoutubeVideoController";

const router = Router();

//Get all youtube videos
router.get("/latest", YoutubeVideoController.listAllYoutubeVideos);

router.get("/live", YoutubeVideoController.listLiveYoutubeVideos);

router.get("/re-fetch-live", YoutubeVideoController.CheckForExistingYoutubeLive, YoutubeVideoController.listAllYoutubeVideos);

export default router;
