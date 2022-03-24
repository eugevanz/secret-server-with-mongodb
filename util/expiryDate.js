import idTime from "./idTime";
import moment from "moment";

export default function expiryDate(_id, expireAfter) {
  const nextDate = idTime(_id).getTime() + expireAfter;
  return moment(nextDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
}
