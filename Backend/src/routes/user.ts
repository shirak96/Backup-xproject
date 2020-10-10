import {Router} from "express";
import UserController from "../controllers/UserController";
import {checkJwt} from "../middleware/checkJwt";

const router = Router();

//Get all users
router.get("/", [checkJwt], UserController.listAllUsers);

// Get one user
router.get("/:id", [checkJwt], UserController.getOneUserById);

//Create a new user
router.post("/", UserController.newUser);

//Edit one user
router.patch("/:id", [checkJwt], UserController.editUser);

//Delete one user
router.delete("/:id", [checkJwt], UserController.deleteUser);

export default router;
