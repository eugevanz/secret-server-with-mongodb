import clientPromise from "../../../lib/mongodb";
import idTime from "../../../util/idTime";
import expiryDate from "../../../util/expiryDate";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const secret = req.body.secret;
    const expireAfter = parseInt(req.body.expireAfter);

    const client = await clientPromise;
    const collection = client.db().collection("secrets_col");
    const promise = await collection.insertOne({ secret, expireAfter });

    res.status(200).json({
      hash: promise._id,
      secretText: promise.secret,
      createdAt: idTime(promise._id).toString(),
      expiresAt: expiryDate(idTime(promise._id), expireAfter),
    });
  }
}
