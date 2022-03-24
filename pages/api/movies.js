import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  const client = await clientPromise;

  const movies = await client
    .db()
    .collection("movies")
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  res.json(movies);
};
