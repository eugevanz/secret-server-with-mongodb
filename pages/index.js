import Head from "next/head";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Button,
} from "react-native-web";
import clientPromise from "../lib/mongodb";
import Secret from "../components/Secret";
import AddSecret from "../components/AddSecret";

const styles = StyleSheet.create({
  container: {
    padding: 22,
    maxWidth: 512,
  },
  h3: { fontSize: 22 },
  input: {
    height: 40,
    marginTop: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default function Home({ isConnected, secrets }) {
  const { control, register, handleSubmit, reset } = useForm();
  const { replace, asPath } = useRouter();
  const [searches, setSearches] = useState([]);

  function onSubmit(data) {
    (data.secret !== "") & (data.expireAfter !== "") &&
      fetch("/api/secret", {
        method: "POST",
        body: JSON.stringify({
          secret: data.secret,
          expireAfter: data.expireAfter,
        }),
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        replace(asPath);
        reset();
      });
  }

  function onSearch({ term }) {
    const termInSecrets = secrets.filter((secret) =>
      secret.secret.toLowerCase().includes(term.toLowerCase())
    );

    if (term.length & termInSecrets.length)
      setSearches(
        termInSecrets.map((secret) =>
          fetch(`/api/secret/${secret._id}`).then((data) => data)
        )
      );
  }

  const renderItem = ({ item }) => <Item title={item.title} />;

  return (
    <div className="container">
      <Head>
        <title>Secret Server Task</title>
        <link
          rel="icon"
          href="https://github.com/eugevanz/secret-server-with-mongodb/blob/6a1db11f31d0abccc9d3017b1e985f47bc2954ec/public/favicon.ico"
        />
      </Head>

      <main>
        {isConnected ? (
          <View style={styles.container}>
            <Text style={styles.h3}>You are connected</Text>

            <AddSecret></AddSecret>

            <FlatList
              style={{ marginTop: 48 }}
              data={secrets}
              keyExtractor={(item) => item._id}
              renderItem={(item) => <Secret item={item} />}
            ></FlatList>
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.h3}>Connect to continue...</Text>
          </View>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = await clientPromise;
    const secrets = await client
      .db()
      .collection("secrets_col")
      .find()
      .toArray();

    return {
      props: {
        isConnected: true,
        secrets: JSON.parse(JSON.stringify(secrets)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}
