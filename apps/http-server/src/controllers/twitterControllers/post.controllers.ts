// import { TwitterApi } from 'twitter-api-v2';
import { accessSecret, accessToken } from '../../config';
import { Request, Response } from 'express';
import { XUserName } from '../../zodTypes';
import axios from 'axios';
import { makeOuthReqData, oauth } from './twtterOAuthConfig';


export async function postTweet(req: Request, res: Response) {
  const {challenger, challenged} = req.body;
  console.log(challenged, challenger);
  const parsedData1 = XUserName.safeParse(challenger);
  const parsedData2 = XUserName.safeParse(challenged);

  if(!parsedData1.success || !parsedData2.success){
    console.log(parsedData1.data, " ", parsedData2.data);
    res.status(403).json({
      success: false,
      message: `invalid usernames`
    })
    return;
  }
  //challenger
  const user1 = parsedData1.data;
  //challenged
  // const user2 = parsedData2.data;
  const user2  = "Ayushsingla32";

  try {
    // const response = await client.v2.tweet("Hello world! This is a tweet from my app 🚀");
    // const response = await client.post('tweet', {"first tweet"})
    const requestForSignature = {
      url: 'https://api.x.com/2/tweets',
      method: 'POST',
    };
    const payload = {
      text: `test message for tagging @${user2}`
    }
    
    const authHeader = oauth.toHeader(
      oauth.authorize(requestForSignature, { key: accessToken!, secret: accessSecret! })
    );


    const response = await axios({
      url: requestForSignature.url,
      method: requestForSignature.method,
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      data: payload,
    });

    console.log(response);
    res.status(200).json({
      success: true,
      message: "post done!",
      data: response.data
    })
    
  } catch (error) {
    console.error("Error posting tweet:", error);
    res.status(500).json({
      success: false,
      error: error
    })
  }
}