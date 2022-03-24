export default function idTime(_id) {
  const text = _id.substring(0, 8);
  return new Date(parseInt(text, 16) * 1000);
}
