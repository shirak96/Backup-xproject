import {Router} from "express";
import NewspaperController from "../controllers/NewspaperController";
import {checkJwt} from "../middleware/checkJwt";
import {checkRequestedLanguage} from "../middleware/checkRequestedLanguage";

const router = Router();

//Get all newspapers
router.get("/", checkRequestedLanguage, NewspaperController.listAllNewspaper);

// Get one newspaper
router.get("/:id", NewspaperController.getOneNewspaperById);

//Create a new newspaper
router.post("/", [checkJwt, checkRequestedLanguage], NewspaperController.newNewspaper);

//Edit one newspaper
router.patch("/:id", [checkJwt], NewspaperController.editNewspaper);
router.put("/:id", [checkJwt], NewspaperController.editNewspaper);

//Delete one newspaper
router.delete("/:id", [checkJwt], NewspaperController.deleteNewspaper);

export default router;
