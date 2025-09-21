import DefaultTheme from "vitepress/theme";
import type { Router } from "vitepress";

// 进度条
import { NProgress } from "nprogress-v2/dist/index.js";
// 样式
import "nprogress-v2/dist/index.css";
import "virtual:group-icons.css"; //代码组样式
import "./style/index.css"; //自定义样式

import { h } from "vue";
import { useData } from "vitepress";
import { watch } from "vue";

import "virtual:uno.css";



// 组件
import MNavLinks from "./components/MNavLinks.vue"; //导航
import HomeUnderline from "./components/HomeUnderline.vue"; // 首页下划线
import confetti from "./components/confetti.vue"; // 五彩纸屑
import xgplayer from "./components/xgplayer.vue"; //西瓜播放器
import ArticleMetadata from "./components/ArticleMetadata.vue"; //字数阅读时间
import Linkcard from "./components/Linkcard.vue"; //链接卡片
import MyLayout from "./components/MyLayout.vue"; //视图过渡
import fluidborder from "./components/fluidborder.vue"; //流体边框仅用于演示
import MouseClick from "./components/MouseClick.vue";
import MouseFollower from "./components/MouseFollower.vue";



// 不蒜子
import { inBrowser } from "vitepress";
import busuanzi from "busuanzi.pure.js";

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined;

export default {
  extends: DefaultTheme,

  enhanceApp({ app, router }: { app: any; router: Router }) {
    // 注册全局组件
    app.component("MNavLinks", MNavLinks); //导航
    app.component("HomeUnderline", HomeUnderline); // 首页下划线
    app.component("confetti", confetti); // 五彩纸屑
    app.component("xgplayer", xgplayer); //西瓜播放器
    app.component("ArticleMetadata", ArticleMetadata); //字数阅读时间
    app.component("Linkcard", Linkcard); //链接卡片
    app.component("fluidborder", fluidborder); //流体边框仅用于演示
    app.component("MouseClick", MouseClick); //鼠标跟随组件
    app.component("MouseFollower", MouseFollower); //鼠标跟随组件
    


    
    // 不蒜子
    if (inBrowser) {
      NProgress.configure({ showSpinner: false });
      router.onBeforeRouteChange = () => {
        NProgress.start(); // 开始进度条
      };
      router.onAfterRouteChange = () => {
        busuanzi.fetch();
        NProgress.done(); // 停止进度条
      };
    }

    // 彩虹背景动画样式
    if (typeof window !== "undefined") {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === "/"),
        { immediate: true }
      );
    }
  },

  //导航
  Layout: () => {
    const props: Record<string, any> = {};
    // 获取 frontmatter
    const { frontmatter } = useData();

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass;
    }

    return h(MyLayout, props);
  }
};

// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return;

    homePageStyle = document.createElement("style");
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`;
    document.body.appendChild(homePageStyle);
  } else {
    if (!homePageStyle) return;

    homePageStyle.remove();
    homePageStyle = undefined;
  }
}
