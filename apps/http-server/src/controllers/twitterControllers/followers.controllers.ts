import axios from "axios";
import { Request, Response } from "express";
import { token } from "../../config";

export const getFollowers = async (req: Request, res: Response) => {
    const screenName = req.body;
    //should add some zod checks

    try {
        const input = {
            cursor: '-1',
            screenName: screenName
        }
        const data = await axios.post(`https://api.apify.com/v2/acts/xbLZMZWSJDAzYUrmI/runs?token=${token}&waitForFinish=1`, input);

        // should add some checks eg: if a wrong screen name is given
        console.log(data.data.data);

        const dataSetId = data.data.data.defaultDatasetId;
        console.log(typeof dataSetId, ' ', dataSetId)
    
        let data2: any[] = [];
        while(data2.length == 0){
            const temp = await axios.get(`https://api.apify.com/v2/datasets/${dataSetId}/items?limit=50&offset=0&clean=1&view=overview`);
            data2 = temp.data
        }
        console.log(data2);
        const users = data2[0].data.users.map((user: any) => {
            return {
                screenName: user.screen_name,
                id: (user.id).toString(),
                name: user.name,
                following: user.friends_count,
                profileImg: user.profile_image_url_https,
                followersCount: user.normal_followers_count
            }
        })
        res.status(202).json({
            result: true,
            users: users 
        })
    } catch (error) {
        console.log(error);
        
    }
}