import { TextInput, View, Button, StyleSheet } from "react-native-web";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";

export default function AddSecret() {
  const { control, handleSubmit, reset } = useForm();
  const { replace, asPath } = useRouter();

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

  return (
    <View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Secret"
          />
        )}
        name="secret"
      ></Controller>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { marginBottom: 12 }]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Lifespan (in seconds)"
          />
        )}
        name="expireAfter"
      ></Controller>

      <Button title="+ Add secret" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
  },
  input: {
    height: 40,
    marginTop: 12,
    borderWidth: 1,
    padding: 10,
  },
});
