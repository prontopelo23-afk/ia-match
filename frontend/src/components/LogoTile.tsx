import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { fonts } from "../theme";

type Props = {
  uri: string;
  name: string;
  bg: string;
  size?: number;
  rounded?: number;
  domain?: string;
};

export default function LogoTile({ uri, name, bg, size = 56, rounded = 14, domain }: Props) {
  // Chain: Clearbit (uri prop) → Google favicons → initials
  const sources: string[] = [];
  if (uri) sources.push(uri);
  if (domain) sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);

  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [uri, domain]);

  const initial = (name || "?").trim().slice(0, 1).toUpperCase();
  const current = sources[idx];

  const onError = () => {
    if (idx + 1 < sources.length) setIdx(idx + 1);
    else setFailed(true);
  };

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: rounded, backgroundColor: bg },
      ]}
    >
      {!failed && current ? (
        <Image
          source={{ uri: current }}
          style={{ width: size * 0.62, height: size * 0.62, borderRadius: 6 }}
          onError={onError}
          resizeMode="contain"
        />
      ) : (
        <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
  initial: { fontFamily: fonts.serif, color: "#fff" },
});
