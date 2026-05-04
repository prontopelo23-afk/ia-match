import { Share } from "react-native";

export const IA_MATCH_PUBLIC_URL = "https://mon-app-complete.vercel.app";

export async function shareApp(reason = "Trouve l’IA adaptée à ton besoin") {
  try {
    await Share.share({
      title: "IA Match",
      message: `${reason} avec IA Match : ${IA_MATCH_PUBLIC_URL}`,
      url: IA_MATCH_PUBLIC_URL,
    });
  } catch {}
}

export async function shareRadar(title: string) {
  try {
    await Share.share({
      title: "Radar IA Match",
      message: `À surveiller sur IA Match : ${title}. ${IA_MATCH_PUBLIC_URL}/actue`,
      url: `${IA_MATCH_PUBLIC_URL}/actue`,
    });
  } catch {}
}
