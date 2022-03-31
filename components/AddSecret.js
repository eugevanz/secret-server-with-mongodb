import { TextInput, View, StyleSheet, Pressable, Text } from "react-native-web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useSpring, animated } from "react-spring";

export default function AddSecret() {
  const { control, handleSubmit, reset } = useForm();
  const { replace, asPath } = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const props = useSpring({
    marginTop: expanded ? 0 : -512,
    opacity: expanded ? 1 : 0,
    delay: 200,
  });

  function onSubmit({ secret }) {
    const timeInSeconds = seconds + minutes * 60 + hours * 3600;

    secret !== "" &&
      fetch("/api/secret", {
        method: "POST",
        body: JSON.stringify({
          secret: secret,
          expireAfterSeconds: timeInSeconds,
        }),
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        replace(asPath);
        reset({ secret: "" });
        setSeconds(0);
        setMinutes(0);
        setHours(0);
      });
  }

  const AnimatedView = animated(View);

  return (
    <View>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={{
          backgroundColor: "white",
          zIndex: 100,
          padding: 28,
          marginBottom: 48,
        }}
      >
        <Text style={{ paddingTop: 28 }}>+ Add a new secret</Text>
      </Pressable>

      <AnimatedView style={props}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.secretInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Secret"
            />
          )}
          name="secret"
        ></Controller>

        <Text style={{ paddingTop: 28 }}>When should it expire?</Text>

        <View style={{ flexDirection: "row" }}>
          <View style={styles.picker}>
            <Text style={styles.input}>{hours}</Text>
            <Text style={styles.inputText}>Hours</Text>
            <Pressable style={styles.crement} onPress={() => setHours(hours++)}>
              <FontAwesomeIcon icon={faAngleUp} />
            </Pressable>
            <Pressable
              style={styles.crement}
              onPress={() => setHours(hours < 1 ? 0 : hours--)}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </Pressable>
          </View>

          <View style={styles.picker}>
            <Text style={styles.input}>{minutes}</Text>
            <Text style={styles.inputText}>Minutes</Text>
            <Pressable
              style={styles.crement}
              onPress={() => setMinutes(minutes > 58 ? 59 : minutes++)}
            >
              <FontAwesomeIcon icon={faAngleUp} />
            </Pressable>
            <Pressable
              style={styles.crement}
              onPress={() => setMinutes(minutes < 1 ? 0 : minutes--)}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </Pressable>
          </View>

          <View style={styles.picker}>
            <Text style={styles.input}>{seconds}</Text>
            <Text style={styles.inputText}>Seconds</Text>
            <Pressable
              style={styles.crement}
              onPress={() => setSeconds(seconds > 58 ? 59 : seconds++)}
            >
              <FontAwesomeIcon icon={faAngleUp} />
            </Pressable>
            <Pressable
              style={styles.crement}
              onPress={() => setSeconds(seconds < 1 ? 0 : seconds--)}
            >
              <FontAwesomeIcon icon={faAngleDown} />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={{ width: "fit-content", float: "right" }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text
            style={{
              padding: 10,
              borderRadius: 10,
              borderWidth: 0,
              backgroundColor: "rgba(63, 191, 127,1)",
              margin: 28,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Submit
          </Text>
        </Pressable>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
  },
  input: {
    fontSize: 88,
    fontWeight: "bold",
  },
  secretInput: {
    borderWidth: 1,
    fontSize: 36,
    marginTop: 4,
    borderRadius: 10,
    padding: 10,
  },
  crement: {
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: "rgba(236, 240, 241,1)",
    color: "rgba(0,0,0,0.7)",
    padding: 10,
    margin: 2,
  },
  picker: {
    flexDirection: "column",
    padding: 4,
    flex: 1,
    textAlign: "center",
  },
});
