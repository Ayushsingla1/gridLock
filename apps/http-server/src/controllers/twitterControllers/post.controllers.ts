// import { TwitterApi } from 'twitter-api-v2';
import { accessSecret, accessToken } from '../../config';
import { XUserName, GameZod } from '../../zodTypes';
import axios from 'axios';
import { oauth } from './twtterOAuthConfig';

interface postTweetProps {
  challenger: string,
  challenged: string,
  game: string
}

export async function postTweet({challenger, challenged, game} : postTweetProps) {
  console.log(challenged, challenger, game);
  const parsedData1 = XUserName.safeParse(challenger);
  const parsedData2 = XUserName.safeParse(challenged);
  const parsedData3 = GameZod.safeParse(game);

  if(!parsedData1.success || !parsedData2.success){
    return {
      status: 403,
      success: false,
      message: `invalid usernames`
    }
  }
  if(!parsedData3.success){
    return {
      status: 403,
      success: false,
      message: `invalid Game`
    }
  }
  const challengerUser = parsedData1.data;
  const challengedUser = parsedData2.data;
  const parsedGame = parsedData3.data;

  try {
    // const response = await client.v2.tweet("Hello world! This is a tweet from my app 🚀");
    // const response = await client.post('tweet', {"first tweet"})
    const requestForSignature = {
      url: 'https://api.x.com/2/tweets',
      method: 'POST',
    };
    const payload = {
      text: `challenger @${challengedUser} has challenged @${challengerUser} at ${parsedGame}!!`
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
    return {
      status: 200,
      success: true,
      message: "post done!",
      data: response.data
    }
    
  } catch (error) {
    console.error("Error posting tweet:", error);
    return {
      status: 500,
      success: false,
      error: error
    }
  }
}