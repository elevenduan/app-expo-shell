import { useEffect, useRef, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Stack, useNavigation } from "expo-router";
import { WebViewMessageEvent, WebViewNavigation } from "react-native-webview";
import {
  createWebView,
  bridge,
  BridgeWebView,
} from "@webview-bridge/react-native";
import VectorIcons from "@expo/vector-icons/AntDesign";
import { injectedJavaScript, bridgeMethod } from "./pocket";

export default function Index({ url }: { url: string }) {
  const [appBridge] = useState(bridge(bridgeMethod));
  const [{ WebView }] = useState(createWebView({ bridge: appBridge }));
  const navigation = useNavigation();
  const refWebView = useRef<BridgeWebView>(null);
  const [webviewCanGoBack, setWebviewCanGoBack] = useState(false);

  // 监听并设置导航栏标题
  function setTitle(title: string) {
    navigation.setOptions({ title });
  }

  function onMessage(event: WebViewMessageEvent) {
    const data = event.nativeEvent.data;
    try {
      const { type, method, params } = JSON.parse(data);
      if (type === "injected" && method === "setTitle" && params) {
        setTitle(params);
      }
    } catch (err) {}
  }

  // 导航栏后退与关闭 // 兼容WebView内部页面后退
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();

        if (!webviewCanGoBack) {
          navigation.dispatch(e.data.action);
        } else {
          refWebView.current?.goBack();
        }
      }),
    [navigation, webviewCanGoBack]
  );

  function onNavigationStateChange(navState: WebViewNavigation) {
    setWebviewCanGoBack(navState.canGoBack);
  }

  function onClose() {
    setWebviewCanGoBack(false);
    setTimeout(navigation.goBack, 0);
  }

  function onBack() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => (
            <>
              <VectorIcons name="left" onPress={onBack} style={styles.left} />
              <VectorIcons name="close" onPress={onClose} style={styles.left} />
            </>
          ),
        }}
      />
      <WebView
        source={{ uri: url }}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        ref={refWebView}
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  left: {
    fontSize: 24,
    color: "#000000",
    marginRight: 16,
  },
});
