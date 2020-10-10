import {Router} from "express";
import SettingController from "../controllers/SettingController";
import {checkJwt} from "../middleware/checkJwt";

const router = Router();

// Get all settings
router.get("/", [checkJwt], SettingController.listAllSetting);
// Search for settings
router.get("/search", SettingController.searchForSettings);

// Get one setting
router.get("/:id", [checkJwt], SettingController.getOneSettingById);

//Create a new setting
router.post("/", [checkJwt], SettingController.newSetting);

//Edit one setting
router.patch("/:id", [checkJwt], SettingController.editSetting);
router.put("/:id", [checkJwt], SettingController.editSetting);

//Delete one setting
router.delete("/:id", [checkJwt], SettingController.deleteSetting);

export default router;
