import {Router} from "express";
import HeroController from "../controllers/HeroController";
import {checkJwt} from "../middleware/checkJwt";
import {checkRequestedLanguage} from "../middleware/checkRequestedLanguage";

const router = Router();

//Get all newspapers
router.get("/", checkRequestedLanguage, HeroController.listAllHero);

// Get one newspaper
router.get("/:id", HeroController.getOneHeroById);

//Create a new newspaper
router.post("/", [checkJwt, checkRequestedLanguage], HeroController.newHero);

//Edit one newspaper
router.patch("/:id", [checkJwt], HeroController.editHero);
router.put("/:id", [checkJwt], HeroController.editHero);

//Delete one newspaper
router.delete("/:id", [checkJwt], HeroController.deleteHero);

export default router;
