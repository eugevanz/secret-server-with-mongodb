import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import moment from "moment";

export default async function handler(req, res) {
  const client = await clientPromise;
  const collection = client.db().collection("secrets_col");

  if (req.method === "POST") {
    const { secret, expireAfterSeconds } = req.body;

    try {
      const promise = await collection.insertOne({
        secret,
        expireAfterSeconds,
      });
      const time = ObjectId(promise._id).getTimestamp();

      res.status(200).json({
        hash: promise._id,
        secretText: promise.secret,
        createdAt: moment(time).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        expiresAt: moment(time)
          .add(parseInt(expireAfterSeconds), "s")
          .format("dddd, MMMM Do YYYY, h:mm:ss a"),
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  }

  if (req.method === "DELETE") {
    try {
      await collection.deleteOne(
        { _id: new ObjectId(req.body) },
        function (err, obj) {
          if (err) throw err;
          res.status(200).json({
            acknowledged: obj.acknowledged,
            deletedCount: obj.deletedCount,
          });
        }
      );
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  }
}
