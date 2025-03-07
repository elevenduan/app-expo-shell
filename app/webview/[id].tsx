import { useLocalSearchParams } from "expo-router";
import WebView from "@/components/WebView";

export default function Index() {
  const { url } = useLocalSearchParams();
  return <WebView url={url?.toString()} />;
}
