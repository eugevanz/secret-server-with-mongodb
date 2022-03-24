import clientPromise from "../../../lib/mongodb";

function idTime(_id) {
  const text = _id.substr(0, 8);
  return new Date(parseInt(text, 16) * 1000);
}

function expiryDate(createdAt, expireAfter) {
  return new Date(createdAt.getTime() + expireAfter).toString();
}

export default function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body);
    const secret = req.body.secret;
    const expireAfter = req.body.expireAfter;

    const client = await clientPromise;
    const collection = client.db().collection("secrets_col");
    const promise = await collection.insertOne(
      JSON.stringify({ secret, expireAfter })
    );

    res.status(200).json({
      hash: promise._id,
      secretText: promise.secret,
      createdAt: idTime(promise._id).toString(),
      expiresAt: expiryDate(idTime(promise._id), expireAfter),
    });
  }

  const secrets = await client.db().collection("secrets_col").find().toArray();

  res.status(200).json({ secrets });
}
