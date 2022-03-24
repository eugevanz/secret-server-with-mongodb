import Head from "next/head";
import { useRouter } from "next/router";
import moment from "moment";
import { useForm } from "react-hook-form";
import clientPromise from "../lib/mongodb";
import idTime from "../util/idTime";
import expiryDate from "../util/expiryDate";

export default function Home({ isConnected, secrets }) {
  const { register, handleSubmit, reset } = useForm();
  const { replace, asPath } = useRouter();

  async function onSubmit(data) {
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

  async function onSearchSubmit(data) {
    data.search !== "" && fetch(`/api/secret/${data.search}`);
  }

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
          <>
            <h4>You are connected</h4>

            <form onSubmit={handleSubmit(onSearchSubmit)}>
              <input
                {...register("search")}
                type="text"
                placeholder="Search"
              ></input>
              <button type="submit">Search</button>
            </form>

            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("secret")}
                type="text"
                placeholder="Secret"
              ></input>
              <input
                {...register("expireAfter")}
                type="number"
                placeholder="Lifespan (in seconds)"
              ></input>
              <button type="submit">+ Add secret</button>
            </form>

            <ol>
              {secrets &&
                secrets.map((secret) => (
                  <li key={secret._id}>
                    <h3>{secret.secret}</h3>
                    <p>
                      Expires on {expiryDate(secret._id, secret.expireAfter)}
                    </p>
                    <small>
                      Created on{" "}
                      {moment(idTime(secret._id)).format(
                        "dddd, MMMM Do YYYY, h:mm:ss a"
                      )}
                    </small>
                  </li>
                ))}
            </ol>
          </>
        ) : (
          <h2>Connect to continue...</h2>
        )}
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
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
