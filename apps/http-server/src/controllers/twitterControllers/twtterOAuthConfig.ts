import OAuth from "oauth-1.0a";
import { apiKey, apiSecret } from "../../config";
import crypto from 'crypto'


export const oauth = new OAuth({
  consumer: { key: apiKey!, secret: apiSecret!},
  signature_method: "HMAC-SHA1",
  hash_function(baseString, key) {
    return crypto
      .createHmac("sha1", key)
      .update(baseString)
      .digest("base64");
  },
});


export const makeOuthReqData = (text:string) => {
    const requestData = {
        url: `https://api.x.com/2/tweets`, // replace with actual API URL
        method: "POST",
        data: {
            text
        },
    };
    return requestData
}
