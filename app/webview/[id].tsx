import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import WebView from "@/components/WebView";

export default function Index() {
  const { url } = useLocalSearchParams();
  return (
    <>
      <StatusBar style="dark" />
      <WebView url={url?.toString()} />
    </>
  );
}
