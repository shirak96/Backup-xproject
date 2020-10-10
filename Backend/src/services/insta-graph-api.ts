import {isNull} from "util";
import * as request from 'request';


export const getInstagramLatestPosts = (access_token: string) => {
    return new Promise<{
        data: [any],
        paging: any
    }>((resolve, reject) => {
        try {
            request(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${access_token}`,
                function (error, response, body) {
                    if (isNull(error)) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(error)
                    }

                });
        } catch (err) {
            err.status = 500;
            err.statusCode = 500;
            reject(err);
        }
    })
};
