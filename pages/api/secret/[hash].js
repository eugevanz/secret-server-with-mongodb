import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { hash } = req.query;

  try {
    const client = await clientPromise;
    const collection = client.db().collection("secrets_col");

    res.status(200).json(collection.findOne({ _id: hash }));
  } catch (error) {
    console.dir(error);
  }
}
