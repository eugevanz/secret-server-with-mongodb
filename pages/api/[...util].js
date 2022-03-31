import { ObjectId } from "mongodb";
import moment from "moment";

export default function handler(req, res) {
  const util = req.query.util;
  const utility = util[0];
  const expireAfterSeconds = util[1];
  const _id = util[2];

  try {
    const time = ObjectId(_id).getTimestamp();
    const expire = parseInt(expireAfterSeconds);

    if (utility === "expiry") {
      if (expire === 0) res.status(200).json(JSON.stringify("Never Expires"));

      res
        .status(200)
        .json(JSON.stringify(moment(time).add(expire, "s").calendar()));
    }
  } catch (error) {
    res.status(200).json(JSON.stringify(error.message));
  }
}
