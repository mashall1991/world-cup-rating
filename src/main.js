import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";

const app = createApp(App);
app.mount("#app");

// Twemoji：把 emoji 国旗渲染成统一的 SVG（Windows 等平台原生不显示旗帜 emoji）
const parseEmoji = () => {
  if (window.twemoji) {
    window.twemoji.parse(document.body, { folder: "svg", ext: ".svg" });
  }
};
let emojiTimer = null;
const observer = new MutationObserver(() => {
  clearTimeout(emojiTimer);
  emojiTimer = setTimeout(parseEmoji, 60);
});
observer.observe(document.querySelector("#app"), { childList: true, subtree: true });
window.addEventListener("load", parseEmoji);
parseEmoji();
