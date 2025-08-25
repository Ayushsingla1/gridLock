import { TwitterApi } from 'twitter-api-v2';
// import Twitter from 'twitter-v2'; 
import { accessSecret, accessToken, apiKey, apiSecret, userToken } from '../../config';

console.log('token: ', userToken);
const client = new TwitterApi(userToken!);

// Post a tweet
async function postTweet() {
  try {
    const response = await client.v2.tweet("Hello world! This is a tweet from my app 🚀");
    // const response = await client.post('tweet', {"first tweet"})
    console.log("Tweet posted:", response);
  } catch (error) {
    console.error("Error posting tweet:", error);
  }
}

postTweet();
