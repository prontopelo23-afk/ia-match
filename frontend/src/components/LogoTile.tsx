import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SvgXml } from "react-native-svg";
import { fonts } from "../theme";
import { resolveBrandLogo } from "../utils/brandLogos";

type Props = {
  uri: string;
  name: string;
  bg: string;
  size?: number;
  rounded?: number;
  domain?: string;
};

function readableAccent(bg: string) {
  if (!bg || !bg.startsWith("#")) return "#FA520F";
  const hex = bg.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return "#FA520F";
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? "#111827" : bg;
}

export default function LogoTile({ uri, name, bg, size = 56, rounded = 14, domain }: Props) {
  const localSvg = useMemo(() => resolveBrandLogo(name, domain), [name, domain]);
  const sources = useMemo(() => {
    const orderedSources = [
      uri,
      domain ? `https://logo.clearbit.com/${domain}` : "",
      domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : "",
      domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=256` : "",
    ].filter(Boolean) as string[];
    return Array.from(new Set(orderedSources));
  }, [uri, domain]);

  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [uri, domain, localSvg]);

  const initial = (name || "?").trim().slice(0, 1).toUpperCase();
  const current = sources[idx];
  const accent = readableAccent(bg);

  const onError = () => {
    if (idx + 1 < sources.length) setIdx(idx + 1);
    else setFailed(true);
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: rounded,
          backgroundColor: "#FFFFFF",
          borderColor: accent,
        },
      ]}
    >
      {localSvg ? (
        <SvgXml xml={localSvg} width={size * 0.72} height={size * 0.72} />
      ) : !failed && current ? (
        <Image
          source={{ uri: current }}
          style={{ width: size * 0.72, height: size * 0.72, borderRadius: 6 }}
          onError={onError}
          resizeMode="contain"
        />
      ) : (
        <Text style={[styles.initial, { fontSize: size * 0.42, color: accent }]}>{initial}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  initial: { fontFamily: fonts.serif, fontWeight: "700" },
});
