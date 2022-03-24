export default function handler(req, res) {
  const { hash } = req.query;
  res.status(200).json({ name: "John Doe" });
}
