import { defineConfig } from "vitepress";

import markdownItTaskCheckbox from "markdown-it-task-checkbox";
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from "vitepress-plugin-group-icons";
import { MermaidMarkdown, MermaidPlugin } from "vitepress-plugin-mermaid";
import UnoCSS from "unocss/vite";

export default defineConfig({
  lang: "zh-CN",
  title: "烜",
  description: "我的vitpress文档教程",

  // #region fav
  head: [["link", { rel: "icon", href: "https://www.godx.site/s.svg" }]],
  // #endregion fav

  base: "/",

  //cleanUrls:true, //开启纯净链接无html

  //启用深色模式
  appearance: "dark",

  //多语言
  locales: {
    root: {
      label: "简体中文",
      lang: "Zh_CN"
    }
  },

  //markdown配置
  markdown: {
    //行号显示
    lineNumbers: true,

    // toc显示一级标题
    toc: { level: [1, 2, 3] },

    // 使用 `!!code` 防止转换
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, "[!code");
        }
      }
    ],

    // 开启图片懒加载
    image: {
      lazyLoading: true
    },

    // 组件插入h1标题下
    config: (md) => {
      (md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === "h1") htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      }),
        md.use(groupIconMdPlugin); //代码组图标
      md.use(markdownItTaskCheckbox); //todo
      md.use(MermaidMarkdown);
    }
  },

  vite: {
    server: {
      host: true,
      open: false
    },
    plugins: [
      UnoCSS(),
      groupIconVitePlugin({
        customIcon: {
          ts: localIconLoader(import.meta.url, "../public/svg/typescript.svg"), //本地ts图标导入
          md: localIconLoader(import.meta.url, "../public/svg/md.svg"), //markdown图标
          css: localIconLoader(import.meta.url, "../public/svg/css.svg"), //css图标
          js: "logos:javascript" //js图标
        }
      }),
      [MermaidPlugin()]
    ],
    optimizeDeps: {
      include: ["mermaid"]
    },
    ssr: {
      noExternal: ["mermaid"]
    }
  },

  lastUpdated: true, //此配置不会立即生效，需git提交后爬取时间戳，没有安装git本地报错可以先注释

  //主题配置
  themeConfig: {
    //左上角logo
    logo: "https://www.godx.site/s.svg",
    //logo: 'https://vitejs.cn/vite3-cn/logo-with-shadow.png', //远程引用
    //siteTitle: false, //标题隐藏

    //设置站点标题 会覆盖title
    //siteTitle: 'Hello World',

    //编辑本页
    editLink: {
      pattern: "https://github.com/GodX-18/blog/edit/master/docs/:path", // 改成自己的仓库
      text: "在GitHub编辑本页"
    },

    //上次更新时间
    lastUpdated: {
      text: "上次更新时间",
      formatOptions: {
        dateStyle: "short", // 可选值full、long、medium、short
        timeStyle: "medium" // 可选值full、long、medium、short
      }
    },

    //导航栏
    nav: [
      {
        text: "阅读",
        items: [
          {
            text: "个人成长",
            items: [
              { text: "认知觉醒", link: "/books/personal-growth/cognitive-awakening/index.html" },
              { text: "清醒地活", link: "/books/personal-growth/live-consciously/index.html" }
            ]
          },
          {
            text: "国学经典",
            items: [
              { text: "道德经", link: "/books/classic-chinese/tao-te-ching/index.html" },
              { text: "韩非子", link: "/books/classic-chinese/han-feizi/index.html" }
            ]
          },
          {
            text: "参考书籍",
            items: [{ text: "海绵阅读法", link: "/books/reference/sponge-reading-method/index.md" }]
          }
        ]
      },
      {
        text: "博客",
        link: "/blog/index.md"
      },
      {
        text: "导航",
        link: "/nav/"
      },
      {
        text: '考试',
        items: [
          {
            text: 'ACE-CPT',
            items: [
              {
                text: '考试大纲',
                link: '/exam/ACE-CPT/考试大纲.md'
              },
              {
                text: '私人教练的角色和执业范围',
                link: '/exam/ACE-CPT/01.md'
              },
              {
                text: 'ACE 整合式健身训练模型',
                link: '/exam/ACE-CPT/02.md'
              }
            ]
          },
        ]
      },
      // {
      //   text: "更新日志",
      //   link: "/changelog"
      // }
    ],

    //侧边栏
    sidebar: {
      books: [
        {
          text: "个人成长",
          base: "/books/personal-growth",
          items: [
            {
              text: "认知觉醒",
              link: "/cognitive-awakening/index.md"
            },
            {
              text: "清醒地活",
              link: "/live-consciously/index.md"
            }
          ]
        },
        {
          text: "国学经典",
          base: "/books/classic-chinese",
          items: [
            { text: "道德经", link: "/tao-te-ching/index.md" },
            { text: "韩非子", link: "/han-feizi/index.md" }
          ]
        },
        {
          text: "参考书籍",
          base: "/books/reference",
          items: [{ text: "海绵阅读法", link: "/sponge-reading-method/index.md" }]
        }
      ],
      exam: [
        {
          text: 'ACE-CPT',
          base: '/exam/ACE-CPT',
          items: [
            {
              text: '考试大纲',
              link: '/考试大纲.md'
            },
            {
              text: '私人教练的角色和执业范围',
              link: '/01.md'
            },
            {
              text: 'ACE 整合式健身训练模型',
              link: '/02.md'
            }
          ]
        }
      ]
    },

    //Algolia搜索
    search: {
      provider: "algolia",
      options: {
        appId: "HIOLIHDFJ1",
        apiKey: "d9f4c0e1c3b26139f31532e4d52cb903",
        indexName: "blog",
        locales: {
          root: {
            placeholder: "搜索文档",
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档"
              },
              modal: {
                searchBox: {
                  resetButtonTitle: "清除查询条件",
                  resetButtonAriaLabel: "清除查询条件",
                  cancelButtonText: "取消",
                  cancelButtonAriaLabel: "取消"
                },
                startScreen: {
                  recentSearchesTitle: "搜索历史",
                  noRecentSearchesText: "没有搜索历史",
                  saveRecentSearchButtonTitle: "保存至搜索历史",
                  removeRecentSearchButtonTitle: "从搜索历史中移除",
                  favoriteSearchesTitle: "收藏",
                  removeFavoriteSearchButtonTitle: "从收藏中移除"
                },
                errorScreen: {
                  titleText: "无法获取结果",
                  helpText: "你可能需要检查你的网络连接"
                },
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                  searchByText: "搜索提供者"
                },
                noResultsScreen: {
                  noResultsText: "无法找到相关结果",
                  suggestedQueryText: "你可以尝试查询",
                  reportMissingResultsText: "你认为该查询应该有结果？",
                  reportMissingResultsLinkText: "点击反馈"
                }
              }
            }
          }
        }
      }
    },

    //社交链接
    socialLinks: [
      // { icon: 'github', link: 'https://github.com/Yiov/vitepress-doc' },
      // { icon: 'twitter', link: 'https://twitter.com/' },
      // { icon: 'discord', link: 'https://chat.vitejs.dev/' },
      // {
      //   icon: {
      //     svg: '<svg t="1703483542872" class="icon" viewBox="0 0 1309 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6274" width="200" height="200"><path d="M1147.26896 912.681417l34.90165 111.318583-127.165111-66.823891a604.787313 604.787313 0 0 1-139.082747 22.263717c-220.607239 0-394.296969-144.615936-394.296969-322.758409s173.526026-322.889372 394.296969-322.889372C1124.219465 333.661082 1309.630388 478.669907 1309.630388 656.550454c0 100.284947-69.344929 189.143369-162.361428 256.130963zM788.070086 511.869037a49.11114 49.11114 0 0 0-46.360916 44.494692 48.783732 48.783732 0 0 0 46.360916 44.494693 52.090549 52.090549 0 0 0 57.983885-44.494693 52.385216 52.385216 0 0 0-57.983885-44.494692z m254.985036 0a48.881954 48.881954 0 0 0-46.09899 44.494692 48.620028 48.620028 0 0 0 46.09899 44.494693 52.385216 52.385216 0 0 0 57.983886-44.494693 52.58166 52.58166 0 0 0-57.951145-44.494692z m-550.568615 150.018161a318.567592 318.567592 0 0 0 14.307712 93.212943c-14.307712 1.080445-28.746387 1.768001-43.283284 1.768001a827.293516 827.293516 0 0 1-162.394168-22.296458l-162.001279 77.955749 46.328175-133.811485C69.410411 600.858422 0 500.507993 0 378.38496 0 166.683208 208.689602 0 463.510935 0c227.908428 0 427.594322 133.18941 467.701752 312.379588a427.463358 427.463358 0 0 0-44.625655-2.619261c-220.24709 0-394.100524 157.74498-394.100525 352.126871zM312.90344 189.143369a64.270111 64.270111 0 0 0-69.803299 55.659291 64.532037 64.532037 0 0 0 69.803299 55.659292 53.694846 53.694846 0 0 0 57.852923-55.659292 53.465661 53.465661 0 0 0-57.852923-55.659291z m324.428188 0a64.040926 64.040926 0 0 0-69.574114 55.659291 64.302852 64.302852 0 0 0 69.574114 55.659292 53.694846 53.694846 0 0 0 57.951145-55.659292 53.465661 53.465661 0 0 0-57.951145-55.659291z" p-id="6275"></path></svg>'
      //   },
      //   link: 'https://weixin.qq.com/',
      //   // You can include a custom label for accessibility too (optional but recommended):
      //   ariaLabel: 'wechat'
      // }
    ],

    //手机端深浅模式文字修改
    darkModeSwitchLabel: "深浅模式",

    //页脚
    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © 2023-${new Date().getFullYear()} 备案号：<a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2024117185号-1</a>`
    },

    //侧边栏文字更改(移动端)
    sidebarMenuLabel: "目录",

    //返回顶部文字修改(移动端)
    returnToTopLabel: "返回顶部",

    //大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: "当前页大纲"
    },

    //自定义上下页名
    docFooter: {
      prev: "上一页",
      next: "下一页"
    }
  }
});
