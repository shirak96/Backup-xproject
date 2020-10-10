import {Router} from "express";
import AuthController from "../controllers/AuthController";
import {checkJwt} from "../middleware/checkJwt";

const router = Router();
// check if the user is authenticated
router.post('/', [checkJwt], AuthController.authenticate);
//Login route
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;
