import { ObjectId } from "mongodb";
import moment from "moment";

export default function handler(req, res) {
  const util = req.query.util;
  const utility = util[0];
  const expireAfter = util[1];
  const _id = util[2];

  try {
    const time = ObjectId(_id).getTimestamp();

    if (utility === "expiry")
      res
        .status(200)
        .json(
          JSON.stringify(
            moment(time).add(parseInt(expireAfter), "s").calendar()
          )
        );

    if (utility === "time")
      res.status(200).json(JSON.stringify(moment(time).calendar()));
  } catch (error) {
    console.dir(error);
  }
}
