import {IncomingWebhook} from '@slack/webhook';

export const sendMessageToSlack = async ({webhookURL, message = "Batata harra"}) => {

    const webhook = new IncomingWebhook(webhookURL);
    await webhook.send({
        text: message
    });
}
