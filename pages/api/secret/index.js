import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import moment from "moment";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { secret, expireAfter } = req.body;

    const client = await clientPromise;
    const collection = client.db().collection("secrets_col");
    const promise = await collection.insertOne({ secret, expireAfter });

    const time = ObjectId(promise._id).getTimestamp();

    res.status(200).json({
      hash: promise._id,
      secretText: promise.secret,
      createdAt: moment(time).format("dddd, MMMM Do YYYY, h:mm:ss a"),
      expiresAt: moment(time)
        .add(parseInt(expireAfter), "s")
        .format("dddd, MMMM Do YYYY, h:mm:ss a"),
    });
  }
}
