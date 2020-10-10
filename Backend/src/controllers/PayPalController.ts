import {NextFunction, Request, Response} from "express";
// https://stackoverflow.com/questions/56974805/paypal-node-sdk-currency-amount-must-be-non-negative-number
import * as paypal from 'paypal-rest-sdk';

import {jsonResponse} from "../utils/response";
import config from '../config/config';

const {REACT_APP_URL, PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_ENVIRENMENT} = config;
paypal.configure({
    'mode': PAYPAL_ENVIRENMENT, //sandbox or live
    'client_id': PAYPAL_CLIENT_ID,
    'client_secret': PAYPAL_SECRET
});

const createPay = (payment) => {
    return new Promise((resolve, reject) => {
        paypal.payment.create(payment, function (err, payment) {
            if (err) {
                reject(err);
            } else {
                resolve(payment);
            }
        });
    });
};
const validateDonationAmount = (amount) => {
    if (isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
        return 1;
    } else {
        return parseFloat(amount);
    }
};

class PayPalController {


    static payWithPayPal = (request: Request, response: Response, next: NextFunction) => {

        const amount = validateDonationAmount(request.body.amount);

        // create payment object
        const payment = {
            "intent": "authorize",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${REACT_APP_URL}/donation/paypal/success`,
                "cancel_url": `${REACT_APP_URL}/donation/paypal/err`
            },
            "transactions": [{
                "amount": {
                    "total": amount,
                    "currency": "USD"
                },
                "description": "Donation",
                "invoice_number": new Date().getTime()
            }]
        };


        // call the create Pay method
        createPay(payment)
            .then((transaction) => {
                // @ts-ignore
                const id = transaction.id;
                // @ts-ignore
                const links = transaction.links;
                let counter = links.length;
                while (counter--) {
                    if (links[counter].method == 'REDIRECT') {
                        // redirect to paypal where user approves the transaction
                        return response.json(jsonResponse(links[counter].href))
                    }
                }
            })
            .catch((err) => {
                next(err);
            });
    };

    static payWithPayPalExecute = (request: Request, response: Response, next: NextFunction) => {
        const paymentId = request.body.paymentId;
        const payerId = request.body.PayerID;
        const amount = validateDonationAmount(request.body.amount);

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": amount // amount
                }
            }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log('An error occurs in  paypal.payment.create');
                console.log(error);
                next(error)
            } else {
                console.log("Get Payment Response");

                const capture_details = {
                    "amount": {
                        "currency": "USD",
                        "total": amount
                    },
                    "is_final_capture": true
                };

                const id = payment.transactions[0].related_resources[0].authorization.id;
                // @ts-ignore
                paypal.authorization.capture(id, capture_details, function (error, capture) {
                    if (error) {
                        console.error(error);
                    } else {
                        response.send(jsonResponse(capture));

                    }
                });
            }
        });
    }
}

export default PayPalController;
