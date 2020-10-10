import {Router} from "express";
import DonationController from "../controllers/DonationController";
import PayPalController from "../controllers/PayPalController";
import StripeController from "../controllers/StripeController";
import {checkJwt} from "../middleware/checkJwt";

const router = Router();

//Get all donations
router.get("/", [checkJwt], DonationController.listAllDonations);

// Get one donation
router.get("/:id", [checkJwt], DonationController.getOneDonationById);

//Create a new donation
router.post("/", DonationController.newDonation);

//Edit one donation
router.patch("/:id", [checkJwt], DonationController.editDonation);

//Delete one donation
router.delete("/:id", [checkJwt], DonationController.deleteDonation);

router.post('/paypal', PayPalController.payWithPayPal);
router.post('/paypal/success', PayPalController.payWithPayPalExecute);

//Create a new donation
router.post("/stripe", StripeController.stripeCharge);

export default router;
