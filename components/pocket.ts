import { router } from "expo-router";

// 监听页面标题 // 事件 type = injected
const injectedTitleListener = `
new MutationObserver(function (mutations) {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: "injected",
      method: "setTitle",
      params: mutations[0].target.innerText,
    })
  );
}).observe(document.querySelector("title"), {
  subtree: true,
  characterData: true,
  childList: true,
});
`;

// 初始化注入页面JS
export const injectedJavaScript = `${injectedTitleListener}`;

// bridge method
async function openWebView({ url }: { url: string }) {
  const id = new Date().getTime();
  router.push({
    pathname: "/webview/[id]",
    params: { id, url },
  });
}

async function closeWebView() {
  if (router.canGoBack()) {
    router.back();
  }
}

export const bridgeMethod = { openWebView, closeWebView };
