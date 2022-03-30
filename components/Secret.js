import moment from "moment";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native-web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const styles = StyleSheet.create({
  item: {
    marginTop: 20,
  },
  title: { fontSize: 20, marginBottom: 4 },
  subtitle: { fontSize: 12 },
  faTrashCan: {
    color: "#d11a2a",
    paddingLeft: 96,
    paddingRight: 10,
  },
  expiry: {
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
  },
});

export default function Secret({ item: { item } }) {
  const [expiry, setExpiry] = useState(null);
  const [time, setTime] = useState(null);

  async function expiryDate() {
    const res = await fetch(`/api/expiry/${item.expireAfter}/${item._id}`);
    const data = await res.json();
    setExpiry(data);
  }

  async function idTime() {
    const res = await fetch(`/api/time/${item._id}`);
    const data = await res.json();
    setTime(data);
  }

  useEffect(() => {
    expiryDate();
    idTime();
  }, [item]);

  return (
    <View style={styles.item}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 4 }}>
          <Text style={styles.title}>{item.secret}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",

              alignItems: "center",
            }}
          >
            <Text>Due date</Text>
            <Text style={styles.expiry}>{expiry && expiry}</Text>
          </View>
        </View>
        <Pressable style={styles.faTrashCan}>
          <FontAwesomeIcon icon={faTrashCan} />
        </Pressable>
      </View>
    </View>
  );
}
