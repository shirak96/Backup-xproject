import {Router} from "express";
import AdminController from "../controllers/AdminController";
import {checkJwt} from "../middleware/checkJwt";

const router = Router();

//Get all users
router.get("/", [checkJwt], AdminController.listAllAdmins);

// Get one user
router.get("/:id", [checkJwt], AdminController.getOneAdminById);

//Create a new user
router.post("/", [checkJwt], AdminController.newAdmin);

//Edit one user
router.patch("/:id", [checkJwt], AdminController.editAdmin);
router.put("/:id", [checkJwt], AdminController.editAdmin);

//Delete one user
router.delete("/:id", [checkJwt], AdminController.deleteAdmin);

export default router;
