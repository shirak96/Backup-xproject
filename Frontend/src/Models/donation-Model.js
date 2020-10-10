import { CallAPI } from './Main.js'


export const Models = {
  processPayPalPayment: async function (amount) {
    return await CallAPI('donation/paypal', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({amount: amount}),
    })
  },
  
  processStripePayment: async function (amount, token) {
    return await CallAPI('donation/stripe', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({amount, stripeToken: token}),
    })
  },
  processDonorInfo: async function (transaction_id, type, about, full_name, email) {
    return await CallAPI('donation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id,
        type,
        about,
        full_name,
        email,
      }),
    })
    
  },
  
  executePayPalPayment: async function (amount, paymentId, PayerID) {
    return await CallAPI('donation/paypal/success', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        paymentId,
        PayerID,
      }),
    })
  }
};
