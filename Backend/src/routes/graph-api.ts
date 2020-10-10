import {Router} from "express";
import InstagramGraphApiController from "../controllers/InstagramGraphApiController";

const router = Router();

//Get Insta user pages
router.get('/insta/posts', InstagramGraphApiController.listLatestInstaPosts);

export default router;
