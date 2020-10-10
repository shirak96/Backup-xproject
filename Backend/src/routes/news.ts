import {Router} from "express";
import NewsController from "../controllers/NewsController";
import {checkJwt} from "../middleware/checkJwt";
import {checkRequestedLanguage} from "../middleware/checkRequestedLanguage";

const router = Router();

//Get all news
router.get("/",checkRequestedLanguage, NewsController.listAllNews);

// Get one news
router.get("/:id", NewsController.getOneNewsById);

//Create a new news
router.post("/", [checkJwt], NewsController.newNews);

//Edit one news
router.put("/:id", [checkJwt], NewsController.editNews);
router.patch("/:id", [checkJwt], NewsController.editNews);

//Delete one news
router.delete("/:id", [checkJwt], NewsController.deleteNews);

export default router;
