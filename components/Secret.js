import moment from "moment";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native-web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const styles = StyleSheet.create({
  item: {
    marginTop: 20,
  },
  title: {
    color: "rgba(0,0,0,0.7)",
    fontSize: 20,
    marginBottom: 4,
    fontWeight: "bold",
  },
  subtitle: { fontSize: 12 },
  faTrashCan: {
    color: "#d11a2a",
    padding: 28,
  },
  expiry: {
    fontSize: 12,
    fontWeight: "bold",
    borderWidth: 0,
    color: "rgba(0,0,0,0.6)",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
  },
});

export default function Secret({ item: { item } }) {
  const { replace, asPath } = useRouter();
  const [expiry, setExpiry] = useState(null);

  async function expiryDate() {
    const res = await fetch(
      `/api/expiry/${item.expireAfterSeconds}/${item._id}`
    );
    const data = await res.json();
    setExpiry(data);
  }

  function deleteOne() {
    fetch("/api/secret", {
      method: "DELETE",
      body: item._id,
    })
      .then(() => replace(asPath))
      .catch((error) => console.log(JSON.stringify(error)));
  }

  useEffect(() => expiryDate(), [item]);

  return (
    <View style={styles.item}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 4,
            borderWidth: 0,
            backgroundColor: "rgba(236, 240, 241,1)",
            borderRadius: 28,
            padding: 12,
            paddingLeft: 16,
            paddingBottom: 10,
          }}
        >
          <Text style={styles.title}>{item.secret}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "rgba(0,0,0,0.6)",
              }}
            >
              Due date
            </Text>
            <Text style={styles.expiry}>{expiry}</Text>
          </View>
        </View>
        <Pressable style={styles.faTrashCan} onPress={deleteOne}>
          <FontAwesomeIcon icon={faTrashCan} />
        </Pressable>
      </View>
    </View>
  );
}
