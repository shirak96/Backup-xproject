export default {
    jwtSecret: process.env.JWT_SECRET || '@QEGTUI',
    APP_URL: process.env.APP_URL || 'http://localhost:8000',
    REACT_APP_URL: process.env.REACT_APP_URL || 'http://localhost:3000',
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '@QEGTUI',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '@QEGTUI',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '@QEGTUI',
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || null,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET || null,
    PAYPAL_ENVIRENMENT: process.env.PAYPAL_ENVIRENMENT || 'sandbox',
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL || null,
};
