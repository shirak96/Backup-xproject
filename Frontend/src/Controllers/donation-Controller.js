import { Models } from "../Models/donation-Model";

export const Controller = {
    processPayPalPayment: async function({amount}) {
        return await Models.processPayPalPayment(amount);
    },
    processStripePayment: async function ({amount, token}) {
        return await Models.processStripePayment(amount, token)
    },
    processDonorInfo: async function ({transaction_id, type, about, full_name, email, logo}) {
        return await Models.processDonorInfo(transaction_id, type, about, full_name, email, logo)
    },
    executePayPalPayment: async function ({amount, paymentId, PayerID}) {
        return await Models.executePayPalPayment(amount, paymentId, PayerID)
    }
}
