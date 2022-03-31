import Head from "next/head";
import { FlatList, StyleSheet, Text, View } from "react-native-web";
import clientPromise from "../lib/mongodb";
import Secret from "../components/Secret";
import AddSecret from "../components/AddSecret";

const styles = StyleSheet.create({
  container: {
    padding: 22,
    flexBasis: 576,
    flexShrink: 1,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 28,
          }}
        >
          {isConnected ? (
            <View style={[styles.container, { padding: 0 }]}>
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
        </View>
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
