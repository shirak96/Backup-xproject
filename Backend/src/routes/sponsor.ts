import {Router} from "express";
import SponsorController from "../controllers/SponsorController";
import {checkJwt} from "../middleware/checkJwt";
import {checkRequestedLanguage} from "../middleware/checkRequestedLanguage";

const router = Router();

//Get all newspapers
router.get("/", checkRequestedLanguage, SponsorController.listAllSponsor);

// Get one newspaper
router.get("/:id", SponsorController.getOneSponsorById);

//Create a new newspaper
router.post("/", [checkJwt], SponsorController.newSponsor);

//Edit one newspaper
router.patch("/:id", [checkJwt], SponsorController.editSponsor);
router.put("/:id", [checkJwt], SponsorController.editSponsor);

//Delete one newspaper
router.delete("/:id", [checkJwt], SponsorController.deleteSponsor);

export default router;
