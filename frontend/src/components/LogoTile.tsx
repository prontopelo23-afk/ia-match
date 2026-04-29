import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { fonts } from "../theme";

type Props = {
  uri: string;
  name: string;
  bg: string;
  size?: number;
  rounded?: number;
};

export default function LogoTile({ uri, name, bg, size = 56, rounded = 14 }: Props) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().slice(0, 1).toUpperCase();
  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: rounded, backgroundColor: bg },
      ]}
    >
      {!failed ? (
        <Image
          source={{ uri }}
          style={{ width: size * 0.62, height: size * 0.62, borderRadius: 6 }}
          onError={() => setFailed(true)}
          resizeMode="contain"
        />
      ) : (
        <Text style={[styles.initial, { fontSize: size * 0.42, color: "#fff" }]}>{initial}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  initial: { fontFamily: fonts.serif, color: "#fff" },
});
