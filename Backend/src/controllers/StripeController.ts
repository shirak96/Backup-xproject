import {NextFunction, Request, Response} from "express";
import Stripe from 'stripe';
import {jsonResponse} from "../utils/response";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-03-02',
});


class StripeController {
    static stripeCharge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {amount} = req.body;
            // Psst. For production-ready applications we recommend not using the
            // amount directly from the client without verifying it first. This is to
            // prevent bad actors from changing the total amount on the client before
            // it gets sent to the server. A good approach is to send the quantity of
            // a uniquely identifiable product and calculate the total price server-side.
            // Then, you would only fulfill orders using the quantity you charged for.

            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "usd"
            });

            res.json(jsonResponse(paymentIntent.client_secret))
            // res.status(200).send(paymentIntent.client_secret);
        } catch (err) {
            // res.status(500).json({ statusCode: 500, message: err.message });
            err.statusCode = 500;
            next(err);
        }
    };
}

export default StripeController;
