// ==UserScript==
// @name         Linux DO · 飞书云文档外观
// @namespace    https://linux.do/
// @version      1.4.0
// @description  将 Linux DO 的主页与话题页换成飞书云文档风格，浅色 / 深色外观自动跟随站点颜色模式。仅改变外观，保留站点原有内容与交互。
// @author       Codex
// @match        https://linux.do/*
// @icon         https://linux.do/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const STYLE_ID = "linuxdo-lark-theme";
  const FAVICON_ID = "lark-favicon";
  const HOME_CLASS = "lark-doc-home";
  const TOPIC_CLASS = "lark-doc-topic";
  const DARK_CLASS = "lark-dark";
  let faviconObserver;

  const CSS = String.raw`
    html.lark-doc-theme {
      color-scheme: light !important;
      --lark-blue: #3370ff;
      --lark-blue-strong: #245bdb;
      --lark-blue-soft: #82a7fc;
      --lark-red: #f54a45;
      --lark-bg: #ffffff;
      --lark-fill: #f5f6f7;
      --lark-fill-2: #f7f8fa;
      --lark-fill-hover: #eff0f1;
      --lark-hover: #e9eaec;
      --lark-row-hover: #f2f3f5;
      --lark-line: #dee0e3;
      --lark-line-2: #e6e8eb;
      --lark-line-soft: #eff0f1;
      --lark-line-strong: #c9cdd4;
      --lark-text: #1f2329;
      --lark-text-2: #646a73;
      --lark-text-3: #8f959e;
      --lark-text-4: #4e5969;
      --lark-text-5: #373c43;
      --lark-text-6: #2b2f36;
      --lark-active-bg: #dfe7f9;
      --lark-highlight: #e8f0ff;
      --lark-timeline: #dbe8ff;
      --lark-scrollbar: #bbbfc4;
      --lark-focus-ring: rgb(51 112 255 / 12%);
      --lark-shadow-1: rgb(31 35 41 / 4%);
      --lark-shadow-2: rgb(31 35 41 / 8%);
      --lark-shadow-3: rgb(31 35 41 / 12%);
      --lark-sidebar: 280px;
      --primary: #1f2329 !important;
      --secondary: #ffffff !important;
      --tertiary: #3370ff !important;
      --quaternary: #3370ff !important;
      --header_background: #ffffff !important;
      --header_primary: #1f2329 !important;
      --highlight: #e8f0ff !important;
      --primary-low: #eff0f1 !important;
      --primary-very-low: #f7f8fa !important;
      --primary-low-mid: #dee0e3 !important;
      --primary-medium: #8f959e !important;
      --primary-high: #646a73 !important;
      --primary-very-high: #2b2f36 !important;
      --d-selected: #e1eaff !important;
      --d-hover: #eff0f1 !important;
      --love: #f54a45 !important;
    }

    /* 深色：对齐飞书网页端规范——暗色下中性色为 #ffffff 透明度梯度，底色 #17171a */
    html.lark-doc-theme.lark-dark {
      color-scheme: dark !important;
      --lark-blue-strong: #7ea6ff;
      --lark-bg: #17171a;
      --lark-fill: #1f1f23;
      --lark-fill-2: #232329;
      --lark-fill-hover: rgb(255 255 255 / 6%);
      --lark-hover: rgb(255 255 255 / 10%);
      --lark-row-hover: rgb(255 255 255 / 6%);
      --lark-line: rgb(255 255 255 / 12%);
      --lark-line-2: rgb(255 255 255 / 8%);
      --lark-line-soft: rgb(255 255 255 / 8%);
      --lark-line-strong: rgb(255 255 255 / 20%);
      --lark-text: rgb(255 255 255 / 89%);
      --lark-text-2: rgb(255 255 255 / 69%);
      --lark-text-3: rgb(255 255 255 / 50%);
      --lark-text-4: rgb(255 255 255 / 69%);
      --lark-text-5: rgb(255 255 255 / 80%);
      --lark-text-6: rgb(255 255 255 / 89%);
      --lark-active-bg: rgb(51 112 255 / 18%);
      --lark-highlight: rgb(51 112 255 / 16%);
      --lark-timeline: rgb(51 112 255 / 30%);
      --lark-scrollbar: rgb(255 255 255 / 30%);
      --lark-focus-ring: rgb(51 112 255 / 25%);
      --lark-shadow-1: rgb(0 0 0 / 20%);
      --lark-shadow-2: rgb(0 0 0 / 30%);
      --lark-shadow-3: rgb(0 0 0 / 45%);
      --primary: rgb(255 255 255 / 89%) !important;
      --secondary: #17171a !important;
      --header_background: #17171a !important;
      --header_primary: rgb(255 255 255 / 89%) !important;
      --highlight: rgb(51 112 255 / 16%) !important;
      --primary-low: rgb(255 255 255 / 8%) !important;
      --primary-very-low: #1f1f23 !important;
      --primary-low-mid: rgb(255 255 255 / 12%) !important;
      --primary-medium: rgb(255 255 255 / 50%) !important;
      --primary-high: rgb(255 255 255 / 69%) !important;
      --primary-very-high: rgb(255 255 255 / 80%) !important;
      --d-selected: rgb(51 112 255 / 18%) !important;
      --d-hover: rgb(255 255 255 / 6%) !important;
    }

    html.lark-doc-theme,
    html.lark-doc-theme body {
      background: var(--lark-bg) !important;
      color: var(--lark-text) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
        "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif !important;
    }

    html.lark-doc-theme body {
      min-width: 980px;
      margin: 0 !important;
    }

    html.lark-doc-theme * {
      scrollbar-color: var(--lark-scrollbar) transparent;
    }

    html.lark-doc-theme a {
      color: inherit;
    }

    /* 帖子正文链接恢复飞书蓝，避免被上方全局 inherit 染黑 */
    html.lark-doc-theme .cooked a {
      color: var(--lark-blue) !important;
    }

    html.lark-doc-theme .global-notice,
    html.lark-doc-theme .category-breadcrumb,
    html.lark-doc-theme .top-lists,
    html.lark-doc-theme .navigation-controls,
    html.lark-doc-theme .topic-map.--bottom {
      display: none !important;
    }

    html.lark-doc-theme button,
    html.lark-doc-theme input,
    html.lark-doc-theme textarea,
    html.lark-doc-theme select {
      font-family: inherit !important;
    }

    /* 顶栏与品牌 */
    html.lark-doc-theme .d-header-wrap {
      position: fixed !important;
      z-index: 1100 !important;
      top: 0 !important;
      right: 0 !important;
      left: 0 !important;
      height: 64px !important;
    }

    html.lark-doc-theme body .d-header {
      position: fixed !important;
      z-index: 1101 !important;
      top: 0 !important;
      right: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 64px !important;
      background:
        linear-gradient(
          90deg,
          var(--lark-fill) 0,
          var(--lark-fill) var(--lark-sidebar),
          var(--lark-bg) var(--lark-sidebar),
          var(--lark-bg) 100%
        ) !important;
      border-bottom: 1px solid var(--lark-line) !important;
      box-shadow: none !important;
    }

    html.lark-doc-theme .d-header .wrap {
      width: 100% !important;
      max-width: none !important;
      padding: 0 16px !important;
      box-sizing: border-box !important;
    }

    html.lark-doc-theme .d-header .contents {
      position: relative !important;
      height: 64px !important;
      display: flex !important;
      align-items: center !important;
    }

    html.lark-doc-theme .d-header .title {
      width: calc(var(--lark-sidebar) - 70px) !important;
      min-width: calc(var(--lark-sidebar) - 70px) !important;
      margin: 0 0 0 4px !important;
    }

    html.lark-doc-theme .d-header .title a {
      display: inline-flex !important;
      align-items: center !important;
      height: 40px !important;
      font-size: 0 !important;
      text-decoration: none !important;
    }

    html.lark-doc-theme .d-header .title img,
    html.lark-doc-theme .d-header .title picture,
    html.lark-doc-theme .d-header .title .logo-big,
    html.lark-doc-theme .d-header .title .logo-small {
      display: none !important;
    }

    html.lark-doc-theme .lark-brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--lark-text);
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
      letter-spacing: -0.2px;
    }

    html.lark-doc-theme .d-header-icons {
      display: flex !important;
      align-items: center !important;
      margin: 0 !important;
      padding: 0 !important;
      list-style: none !important;
    }

    html.lark-doc-theme .lark-brand svg {
      width: 25px;
      height: 25px;
      flex: none;
    }

    html.lark-doc-theme .d-header .header-sidebar-toggle button,
    html.lark-doc-theme .d-header .hamburger-dropdown button {
      width: 36px !important;
      min-width: 36px !important;
      height: 36px !important;
      padding: 0 !important;
      border: 0 !important;
      color: var(--lark-text-2) !important;
      background: transparent !important;
      border-radius: 7px !important;
    }

    html.lark-doc-theme .d-header .header-sidebar-toggle button:hover,
    html.lark-doc-theme .d-header .hamburger-dropdown button:hover {
      background: var(--lark-hover) !important;
    }

    html.lark-doc-theme .d-header .panel {
      position: relative !important;
      z-index: 3 !important;
      margin-left: auto !important;
    }

    html.lark-doc-theme .lark-topic-context {
      position: absolute;
      left: calc(var(--lark-sidebar) + 16px);
      right: 280px;
      top: 9px;
      z-index: 2;
      min-width: 0;
      pointer-events: none;
    }

    html.lark-doc-theme .lark-topic-crumbs {
      overflow: hidden;
      color: var(--lark-text-4);
      font-size: 14px;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    html.lark-doc-theme .lark-topic-meta {
      color: var(--lark-text-3);
      font-size: 12px;
      line-height: 20px;
      white-space: nowrap;
    }

    html.lark-doc-theme .lark-topic-meta::before {
      content: "◆";
      margin-right: 6px;
      color: var(--lark-text-3);
      font-size: 8px;
    }

    html.lark-doc-theme.lark-doc-topic .d-header .extra-info-wrapper {
      display: none !important;
    }

    /* 左侧导航：保留全部 Linux DO 导航，仅换外观 */
    html.lark-doc-theme .sidebar-wrapper {
      width: var(--lark-sidebar) !important;
      min-width: var(--lark-sidebar) !important;
      height: calc(100vh - 64px) !important;
      min-height: calc(100vh - 64px) !important;
      position: sticky !important;
      top: 64px !important;
      align-self: stretch !important;
      overflow: visible !important;
      background: var(--lark-fill) !important;
      border-right: 1px solid var(--lark-line-soft) !important;
      box-shadow: none !important;
    }

    html.lark-doc-theme .sidebar-container {
      width: var(--lark-sidebar) !important;
      height: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      padding: 8px 8px 10px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      background: var(--lark-fill) !important;
    }

    html.lark-doc-theme .sidebar-sections {
      flex: 1 1 auto !important;
      overflow: auto !important;
      padding: 0 !important;
    }

    html.lark-doc-theme .lark-sidebar-search {
      display: flex;
      flex: 0 0 36px;
      align-items: center;
      gap: 9px;
      height: 36px;
      min-height: 36px;
      margin: 0 0 8px;
      padding: 0 12px;
      box-sizing: border-box;
      border: 1px solid transparent;
      border-radius: 7px;
      background: var(--lark-bg);
      color: var(--lark-text-4) !important;
      font-size: 14px;
      text-decoration: none !important;
      box-shadow: 0 1px 2px var(--lark-shadow-1);
    }

    html.lark-doc-theme .lark-sidebar-search:hover {
      border-color: var(--lark-line-strong);
      background: var(--lark-bg) !important;
    }

    html.lark-doc-theme .lark-sidebar-search svg {
      width: 17px;
      height: 17px;
      color: var(--lark-text-2);
      flex: none;
    }

    html.lark-doc-theme .sidebar-section {
      margin: 0 0 7px !important;
      padding: 0 0 7px !important;
      border-bottom-color: var(--lark-line-2) !important;
    }

    html.lark-doc-theme .sidebar-section-header {
      padding: 4px 10px !important;
      color: var(--lark-text-3) !important;
      font-size: 12px !important;
      font-weight: 500 !important;
    }

    html.lark-doc-theme .sidebar-section-link-wrapper {
      margin: 1px 0 !important;
      border-radius: 7px !important;
    }

    html.lark-doc-theme .sidebar-section-link-wrapper:hover {
      background: var(--lark-hover) !important;
    }

    html.lark-doc-theme .sidebar-section-link-wrapper.is-active,
    html.lark-doc-theme .sidebar-section-link-wrapper.active,
    html.lark-doc-theme .sidebar-section-link-wrapper[data-list-item-name="everything"]:has(a.active) {
      background: var(--lark-active-bg) !important;
    }

    html.lark-doc-theme .sidebar-section-link {
      min-height: 38px !important;
      padding: 0 10px !important;
      border-radius: 7px !important;
      color: var(--lark-text-5) !important;
      font-size: 15px !important;
      font-weight: 400 !important;
    }

    html.lark-doc-theme .sidebar-section-link-wrapper.is-active .sidebar-section-link,
    html.lark-doc-theme .sidebar-section-link-wrapper.active .sidebar-section-link,
    html.lark-doc-theme .sidebar-section-link.active {
      color: var(--lark-blue-strong) !important;
      font-weight: 500 !important;
    }

    html.lark-doc-theme .sidebar-section-link .sidebar-section-link-prefix,
    html.lark-doc-theme .sidebar-section-link .d-icon {
      color: var(--lark-text-2) !important;
    }

    html.lark-doc-theme .sidebar-section-link-wrapper.is-active .d-icon,
    html.lark-doc-theme .sidebar-section-link.active .d-icon {
      color: var(--lark-blue) !important;
    }

    html.lark-doc-theme .sidebar-section-link-content-text {
      line-height: 20px !important;
    }

    html.lark-doc-theme .sidebar-footer-wrapper {
      background: var(--lark-fill) !important;
      border-top: 1px solid var(--lark-line-2) !important;
      box-shadow: none !important;
    }

    html.lark-doc-theme .sidebar-footer-actions-button {
      border-radius: 7px !important;
      color: var(--lark-text-2) !important;
    }

    html.lark-doc-theme .sidebar-footer-actions-button:hover {
      background: var(--lark-hover) !important;
    }

    /* 主内容基础布局 */
    html.lark-doc-theme #main-outlet-wrapper {
      width: 100% !important;
      max-width: none !important;
      display: grid !important;
      grid-template-columns: var(--lark-sidebar) minmax(0, 1fr) !important;
      grid-template-rows: 1fr !important;
      min-height: calc(100vh - 64px) !important;
      align-items: stretch !important;
      gap: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    html.lark-doc-theme #main-outlet {
      width: auto !important;
      max-width: none !important;
      min-width: 0 !important;
      min-height: calc(100vh - 64px) !important;
      padding: 22px 28px 80px !important;
      box-sizing: border-box !important;
      background: var(--lark-bg) !important;
    }

    html.lark-doc-theme #main-outlet-wrapper:not(:has(> .sidebar-wrapper)) {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    html.lark-doc-theme body:not(.has-sidebar-page) .sidebar-wrapper {
      display: none !important;
    }

    html.lark-doc-theme body:not(.has-sidebar-page) #main-outlet-wrapper {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    html.lark-doc-theme body:not(.has-sidebar-page) #main-outlet {
      grid-column: 1 !important;
    }

    html.lark-doc-theme body:not(.has-sidebar-page) .d-header .title {
      display: none !important;
    }

    html.lark-doc-theme body:not(.has-sidebar-page) .d-header {
      background: var(--lark-bg) !important;
    }

    html.lark-doc-theme body:not(.has-sidebar-page) .lark-topic-context {
      left: 72px;
    }

    html.lark-doc-theme.lark-doc-home #main-outlet-wrapper {
      min-height: 100vh !important;
    }

    html.lark-doc-theme.lark-doc-home .sidebar-wrapper {
      top: 0 !important;
      height: 100vh !important;
      min-height: 100vh !important;
    }

    html.lark-doc-theme.lark-doc-home .sidebar-container {
      padding-top: 72px !important;
    }

    html.lark-doc-theme.lark-doc-home #main-outlet {
      min-height: 100vh !important;
      padding-top: 86px !important;
    }

    html.lark-doc-theme .lark-home-heading {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 280px;
      left: calc(var(--lark-sidebar) + 16px);
      display: flex;
      align-items: center;
      height: 64px;
      margin: 0;
      color: var(--lark-text);
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      letter-spacing: -0.3px;
      pointer-events: none;
    }

    html.lark-doc-theme body:not(.has-sidebar-page) .lark-home-heading {
      left: 72px;
    }

    html.lark-doc-theme .alert,
    html.lark-doc-theme .banner-box,
    html.lark-doc-theme .custom-homepage-columns {
      border-radius: 8px !important;
      box-shadow: none !important;
    }

    html.lark-doc-theme .d-header .select-kit-header,
    html.lark-doc-theme .d-header .combo-box-header,
    html.lark-doc-theme .sidebar-wrapper .select-kit-header,
    html.lark-doc-theme .sidebar-wrapper .combo-box-header {
      min-height: 34px;
      border-radius: 7px !important;
      background: var(--lark-bg) !important;
      color: var(--lark-text-5) !important;
      box-shadow: none !important;
      font-weight: 400 !important;
    }

    html.lark-doc-theme .d-header .select-kit-header:hover,
    html.lark-doc-theme .d-header .combo-box-header:hover,
    html.lark-doc-theme .sidebar-wrapper .select-kit-header:hover,
    html.lark-doc-theme .sidebar-wrapper .combo-box-header:hover {
      background: var(--lark-fill-2) !important;
    }

    html.lark-doc-theme .sidebar-section-header,
    html.lark-doc-theme .sidebar-section-header.btn,
    html.lark-doc-theme .sidebar-section-header button,
    html.lark-doc-theme .sidebar-section-header .btn,
    html.lark-doc-theme .sidebar-section-header .select-kit-header {
      min-height: 30px !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }

    html.lark-doc-theme .sidebar-section-header:hover,
    html.lark-doc-theme .sidebar-section-header.btn:hover,
    html.lark-doc-theme .sidebar-section-header button:hover,
    html.lark-doc-theme .sidebar-section-header .btn:hover {
      border-color: transparent !important;
      background: transparent !important;
    }

    /* 主页：话题列表映射为云文档文件表格 */
    html.lark-doc-theme.lark-doc-home .welcome-banner,
    html.lark-doc-theme.lark-doc-home .welcome-banner-wrapper,
    html.lark-doc-theme.lark-doc-home .above-main-container-outlet.welcome-link-banner-connector,
    html.lark-doc-theme.lark-doc-home .discourse-banner {
      display: none !important;
    }

    html.lark-doc-theme.lark-doc-home .list-controls {
      margin: 0 0 4px !important;
    }

    html.lark-doc-theme.lark-doc-home .navigation-container {
      display: flex !important;
      width: 100% !important;
      min-height: 48px !important;
      margin: 0 !important;
      padding: 0 !important;
      border-bottom: 1px solid var(--lark-line) !important;
      align-items: center !important;
    }

    html.lark-doc-theme.lark-doc-home .navigation-container .nav-pills {
      display: flex !important;
      flex: 0 1 auto !important;
      align-items: stretch !important;
      margin: 0 !important;
      padding: 0 !important;
      list-style: none !important;
    }

    html.lark-doc-theme.lark-doc-home .navigation-container > .lark-create-topic-slot {
      display: flex !important;
      flex: 0 0 auto !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 48px !important;
      margin: 0 0 0 auto !important;
      padding: 0 !important;
      list-style: none !important;
    }

    html.lark-doc-theme.lark-doc-home .navigation-container .lark-create-topic {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      width: auto !important;
      min-width: 100px !important;
      height: 36px !important;
      min-height: 36px !important;
      margin: 6px 0 !important;
      padding: 0 12px !important;
      border: 0 !important;
      border-radius: 7px !important;
      background: transparent !important;
      color: var(--lark-text-2) !important;
      font-size: 0 !important;
      box-shadow: none !important;
    }

    html.lark-doc-theme.lark-doc-home .navigation-container .lark-create-topic:hover {
      border-color: transparent !important;
      background: var(--lark-fill-hover) !important;
      color: var(--lark-text) !important;
    }

    html.lark-doc-theme.lark-doc-home .lark-create-topic > * {
      display: none !important;
    }

    html.lark-doc-theme.lark-doc-home .lark-create-topic::before {
      content: "+";
      display: block;
      font-size: 21px;
      font-weight: 300;
      line-height: 1;
    }

    html.lark-doc-theme.lark-doc-home .lark-create-topic::after {
      content: "新建话题";
      display: block;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      white-space: nowrap;
    }

    html.lark-doc-theme.lark-doc-home .navigation-container .nav-pills,
    html.lark-doc-theme.lark-doc-home .navigation-container .nav-pills > li {
      min-height: 48px !important;
      align-items: stretch !important;
    }

    html.lark-doc-theme.lark-doc-home .nav-pills > li > a,
    html.lark-doc-theme.lark-doc-home .nav-pills > li > button {
      display: flex !important;
      align-items: center !important;
      min-height: 48px !important;
      padding: 0 13px !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      color: var(--lark-text-2) !important;
      font-size: 14px !important;
      font-weight: 400 !important;
    }

    html.lark-doc-theme.lark-doc-home .nav-pills > li > a.active,
    html.lark-doc-theme.lark-doc-home .nav-pills > li.active > a,
    html.lark-doc-theme.lark-doc-home .nav-pills > li > button.active {
      position: relative;
      color: var(--lark-blue-strong) !important;
    }

    html.lark-doc-theme.lark-doc-home .nav-pills > li > a.active::after,
    html.lark-doc-theme.lark-doc-home .nav-pills > li.active > a::after,
    html.lark-doc-theme.lark-doc-home .nav-pills > li > button.active::after {
      content: "";
      position: absolute;
      right: 12px;
      bottom: -1px;
      left: 12px;
      height: 2px;
      border-radius: 2px 2px 0 0;
      background: var(--lark-blue);
    }

    html.lark-doc-theme.lark-doc-home .topic-list {
      width: 100% !important;
      margin-top: 0 !important;
      border-collapse: collapse !important;
      border-spacing: 0 !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-header {
      height: 42px !important;
      color: var(--lark-text-3) !important;
      font-size: 13px !important;
      font-weight: 400 !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-header th {
      height: 42px !important;
      padding: 0 12px !important;
      border-bottom: 1px solid var(--lark-line) !important;
      color: var(--lark-text-3) !important;
      font-size: 0 !important;
      font-weight: 400 !important;
      text-align: left !important;
      vertical-align: middle !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-header th .lark-column-label {
      color: var(--lark-text-3) !important;
      font-size: 13px !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-header th .d-icon {
      margin-left: 4px;
      font-size: 12px !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item,
    html.lark-doc-theme.lark-doc-home .topic-list-body .topic-list-item {
      height: 64px !important;
      background: var(--lark-bg) !important;
      border: 0 !important;
      transition: background-color 120ms ease;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item:hover,
    html.lark-doc-theme.lark-doc-home .topic-list-item.selected {
      background: var(--lark-row-hover) !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item > td,
    html.lark-doc-theme.lark-doc-home .topic-list-body .topic-list-item > td {
      height: 64px !important;
      padding: 8px 12px !important;
      border-bottom: 1px solid var(--lark-line-soft) !important;
      color: var(--lark-text-2) !important;
      vertical-align: middle !important;
      box-sizing: border-box !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .main-link {
      position: relative;
      box-sizing: border-box !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .main-link .link-top-line,
    html.lark-doc-theme.lark-doc-home .topic-list-item .main-link .link-bottom-line {
      display: block !important;
      width: 100% !important;
      min-width: 0 !important;
      padding-left: 39px !important;
      box-sizing: border-box !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .main-link::before {
      content: "";
      position: absolute;
      left: 12px;
      top: 50%;
      width: 25px;
      height: 30px;
      border-radius: 5px;
      background:
        linear-gradient(#ffffff, #ffffff) 7px 9px / 11px 2px no-repeat,
        linear-gradient(#ffffff, #ffffff) 7px 14px / 11px 2px no-repeat,
        linear-gradient(#ffffff, #ffffff) 7px 19px / 8px 2px no-repeat,
        #3370ff;
      box-shadow: inset 0 0 0 1px rgb(0 0 0 / 4%);
      transform: translateY(-50%);
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .title,
    html.lark-doc-theme.lark-doc-home .topic-list-item .title a,
    html.lark-doc-theme.lark-doc-home .topic-list-item .link-top-line a.title {
      color: var(--lark-text-6) !important;
      font-size: 15px !important;
      font-weight: 400 !important;
      line-height: 22px !important;
      text-decoration: none !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .title:hover,
    html.lark-doc-theme.lark-doc-home .topic-list-item .title a:hover,
    html.lark-doc-theme.lark-doc-home .topic-list-item .link-top-line a.title:hover {
      color: var(--lark-blue-strong) !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .link-bottom-line,
    html.lark-doc-theme.lark-doc-home .topic-list-item .discourse-tags,
    html.lark-doc-theme.lark-doc-home .topic-list-item .badge-wrapper {
      color: var(--lark-text-3) !important;
      font-size: 12px !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .posters img {
      width: 25px !important;
      height: 25px !important;
      border: 2px solid var(--lark-bg) !important;
      border-radius: 50% !important;
      box-sizing: border-box !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .posters a:not(:first-child) {
      margin-left: -7px !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list-item .posts,
    html.lark-doc-theme.lark-doc-home .topic-list-item .views,
    html.lark-doc-theme.lark-doc-home .topic-list-item .activity {
      color: var(--lark-text-2) !important;
      font-size: 13px !important;
      font-weight: 400 !important;
    }

    html.lark-doc-theme.lark-doc-home .topic-list .num a {
      color: inherit !important;
      font-weight: 400 !important;
    }

    html.lark-doc-theme.lark-doc-home .show-more.has-topics .alert {
      width: max-content !important;
      margin: 10px auto !important;
      padding: 7px 16px !important;
      border: 0 !important;
      border-radius: 7px !important;
      background: var(--lark-highlight) !important;
      color: var(--lark-blue-strong) !important;
    }

    /* 话题页：主帖是文档，回复是评论线程 */
    html.lark-doc-theme.lark-doc-topic #main-outlet {
      padding-top: 80px !important;
    }

    html.lark-doc-theme.lark-doc-topic #topic-title,
    html.lark-doc-theme.lark-doc-topic .container.posts,
    html.lark-doc-theme.lark-doc-topic .topic-above-post-stream-outlet {
      max-width: 1020px !important;
    }

    html.lark-doc-theme.lark-doc-topic #topic-title {
      margin: 20px auto 12px !important;
      padding: 0 36px !important;
      box-sizing: border-box !important;
    }

    html.lark-doc-theme.lark-doc-topic #topic-title h1,
    html.lark-doc-theme.lark-doc-topic #topic-title .fancy-title,
    html.lark-doc-theme.lark-doc-topic #topic-title .fancy-title a {
      margin: 0 !important;
      color: var(--lark-text) !important;
      font-size: clamp(28px, 2.2vw, 38px) !important;
      font-weight: 700 !important;
      line-height: 1.35 !important;
      letter-spacing: -0.8px !important;
      text-decoration: none !important;
    }

    html.lark-doc-theme.lark-doc-topic #topic-title .topic-category,
    html.lark-doc-theme.lark-doc-topic #topic-title .badge-wrapper,
    html.lark-doc-theme.lark-doc-topic #topic-title .discourse-tags {
      margin-top: 8px !important;
      color: var(--lark-text-3) !important;
      font-size: 13px !important;
    }

    html.lark-doc-theme.lark-doc-topic .container.posts {
      display: flex !important;
      align-items: flex-start !important;
      margin: 0 auto !important;
      box-sizing: border-box !important;
    }

    html.lark-doc-theme.lark-doc-topic .post-stream {
      flex: 1 1 auto !important;
      min-width: 0 !important;
      order: 1 !important;
    }

    /* 右侧楼层轴伪装成文档评论定位轨道 */
    html.lark-doc-theme.lark-doc-topic .topic-navigation {
      width: 116px !important;
      margin-left: 12px !important;
      order: 2 !important;
    }

    html.lark-doc-theme.lark-doc-topic .topic-timeline {
      margin-left: 0 !important;
      color: var(--lark-text-3) !important;
    }

    html.lark-doc-theme.lark-doc-topic .timeline-container {
      width: 116px !important;
    }

    html.lark-doc-theme.lark-doc-topic .timeline-scrollarea {
      border-left-color: var(--lark-timeline) !important;
    }

    html.lark-doc-theme.lark-doc-topic .timeline-handle {
      width: 5px !important;
      border-radius: 4px !important;
      background: var(--lark-blue-soft) !important;
    }

    html.lark-doc-theme.lark-doc-topic .timeline-date-wrapper,
    html.lark-doc-theme.lark-doc-topic .timeline-ago,
    html.lark-doc-theme.lark-doc-topic .timeline-replies {
      color: var(--lark-text-3) !important;
      font-size: 12px !important;
    }

    /* 回复编辑器改成评论输入区域 */
    html.lark-doc-theme .d-editor-container,
    html.lark-doc-theme .composer-popup,
    html.lark-doc-theme #reply-control {
      border-color: var(--lark-line) !important;
      background: var(--lark-bg) !important;
      box-shadow: 0 -4px 20px var(--lark-shadow-2) !important;
    }

    html.lark-doc-theme .d-editor-textarea-wrapper,
    html.lark-doc-theme .d-editor-input {
      border-color: var(--lark-line-strong) !important;
      border-radius: 8px !important;
      background: var(--lark-bg) !important;
      color: var(--lark-text) !important;
      box-shadow: none !important;
    }

    html.lark-doc-theme .d-editor-textarea-wrapper:focus-within {
      border-color: var(--lark-blue-soft) !important;
      box-shadow: 0 0 0 2px var(--lark-focus-ring) !important;
    }

    html.lark-doc-theme .d-editor-button-bar {
      border-color: var(--lark-line-soft) !important;
      background: var(--lark-fill-2) !important;
    }

    html.lark-doc-theme .d-editor-button-bar .btn {
      border: 0 !important;
      background: transparent !important;
    }

    html.lark-doc-theme .menu-panel,
    html.lark-doc-theme .select-kit-body,
    html.lark-doc-theme .dropdown-menu {
      border: 1px solid var(--lark-line) !important;
      border-radius: 8px !important;
      background: var(--lark-bg) !important;
      box-shadow: 0 8px 24px var(--lark-shadow-3) !important;
    }

    html.lark-doc-theme .select-kit-row:hover,
    html.lark-doc-theme .select-kit-row.is-highlighted,
    html.lark-doc-theme .menu-panel li:hover {
      background: var(--lark-row-hover) !important;
    }

    /* 窄屏只保证可用，不另做移动端仿制 */
    @media (max-width: 1100px) {
      html.lark-doc-theme .lark-topic-context {
        left: calc(var(--lark-sidebar) + 12px);
        right: 220px;
      }

      html.lark-doc-theme .lark-home-heading {
        left: calc(var(--lark-sidebar) + 12px);
        right: 220px;
      }

      html.lark-doc-theme.lark-doc-topic .topic-navigation,
      html.lark-doc-theme.lark-doc-topic .timeline-container {
        width: 90px !important;
      }
    }
  `;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    if (!document.documentElement) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function makeBrand() {
    const titleLink = document.querySelector(".d-header .title a");
    if (!titleLink || titleLink.querySelector(".lark-brand")) return;

    const brand = document.createElement("span");
    brand.className = "lark-brand";
    brand.setAttribute("aria-label", "飞书云文档");
    brand.innerHTML = `
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="LarkLogoColorful" aria-hidden="true">
        <path d="m12.924 12.803.056-.054c.038-.034.076-.072.11-.11l.077-.076.23-.227 1.334-1.319.335-.331c.063-.063.13-.123.195-.183a7.777 7.777 0 0 1 1.823-1.24 7.607 7.607 0 0 1 1.014-.4 13.177 13.177 0 0 0-2.5-5.013 1.203 1.203 0 0 0-.94-.448h-9.65c-.173 0-.246.224-.107.325a28.23 28.23 0 0 1 8 9.098c.007-.006.016-.013.023-.022Z" fill="#00D6B9"></path>
        <path d="M9.097 21.299a13.258 13.258 0 0 0 11.82-7.247 5.576 5.576 0 0 1-.731 1.076 5.315 5.315 0 0 1-.745.7 5.117 5.117 0 0 1-.615.404 4.626 4.626 0 0 1-.726.331 5.312 5.312 0 0 1-1.883.312 5.892 5.892 0 0 1-.524-.031 6.509 6.509 0 0 1-.729-.126c-.06-.016-.12-.029-.18-.044-.166-.044-.33-.092-.494-.14-.082-.024-.164-.046-.246-.072-.123-.038-.247-.072-.366-.11l-.3-.095-.284-.094-.192-.067c-.08-.025-.155-.053-.234-.082a3.49 3.49 0 0 1-.167-.06c-.11-.04-.221-.079-.328-.12-.063-.025-.126-.047-.19-.072l-.252-.098c-.088-.035-.18-.07-.268-.107l-.174-.07c-.072-.028-.141-.06-.214-.088l-.164-.07c-.057-.024-.114-.05-.17-.075l-.149-.066-.135-.06-.14-.063a90.183 90.183 0 0 1-.141-.066 4.808 4.808 0 0 0-.18-.083c-.063-.028-.123-.06-.186-.088a5.697 5.697 0 0 1-.199-.098 27.762 27.762 0 0 1-8.067-5.969.18.18 0 0 0-.312.123l.006 9.21c0 .4.199.779.533 1a13.177 13.177 0 0 0 7.326 2.205Z" fill="#3370FF"></path>
        <path d="M23.732 9.295a7.55 7.55 0 0 0-3.35-.776 7.521 7.521 0 0 0-2.284.35c-.054.016-.107.035-.158.05a8.297 8.297 0 0 0-.855.35 7.14 7.14 0 0 0-.552.297 6.716 6.716 0 0 0-.533.347c-.123.089-.243.18-.363.275-.13.104-.252.211-.375.321-.067.06-.13.123-.196.184l-.334.328-1.338 1.321-.23.228-.076.075c-.038.038-.076.073-.11.11l-.057.054a1.914 1.914 0 0 1-.085.08c-.032.028-.063.06-.095.088a13.286 13.286 0 0 1-2.748 1.946c.06.028.12.057.18.082l.142.066c.044.022.091.041.139.063l.135.06.149.067.17.075.164.07c.073.031.142.06.215.088.056.025.116.047.173.07.088.034.177.072.268.107.085.031.168.066.253.098l.189.072c.11.041.218.082.328.12.057.019.11.041.167.06.08.028.155.053.234.082l.192.066.284.095.3.095c.123.037.243.075.366.11l.246.072c.164.048.331.095.495.14.06.015.12.03.18.043.114.029.227.05.34.07.13.022.26.04.389.057a5.815 5.815 0 0 0 .994.019 5.172 5.172 0 0 0 1.413-.3 5.405 5.405 0 0 0 .726-.334c.06-.035.122-.07.182-.108a7.96 7.96 0 0 0 .432-.297 5.362 5.362 0 0 0 .577-.517 5.285 5.285 0 0 0 .37-.429 5.797 5.797 0 0 0 .527-.827l.13-.258 1.166-2.325-.003.006a7.391 7.391 0 0 1 1.527-2.186Z" fill="#133C9A"></path>
      </svg>
      <span>飞书云文档</span>`;
    titleLink.appendChild(brand);
  }

  function makeFavicon() {
    const head = document.head;
    const logo = document.querySelector(".lark-brand svg");
    if (!head || !logo) return;

    const faviconSvg = logo.cloneNode(true);
    faviconSvg.setAttribute("width", "32");
    faviconSvg.setAttribute("height", "32");
    faviconSvg.removeAttribute("aria-hidden");
    faviconSvg.removeAttribute("data-icon");
    const faviconHref = `data:image/svg+xml,${encodeURIComponent(
      new XMLSerializer().serializeToString(faviconSvg)
    )}`;

    let favicon = document.getElementById(FAVICON_ID);
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.id = FAVICON_ID;
      favicon.rel = "icon";
      head.appendChild(favicon);
    }

    for (const icon of head.querySelectorAll("link[rel~='icon']")) {
      if (icon.getAttribute("type") !== "image/svg+xml") {
        icon.setAttribute("type", "image/svg+xml");
      }
      if (icon.getAttribute("sizes") !== "any") icon.setAttribute("sizes", "any");
      if (icon.getAttribute("href") !== faviconHref) {
        icon.setAttribute("href", faviconHref);
      }
    }

    if (!faviconObserver) {
      faviconObserver = new MutationObserver(makeFavicon);
      faviconObserver.observe(head, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["href", "rel", "type", "sizes"]
      });
    }
  }

  // 对齐 linux.do 自身的颜色模式：深色配色样式表 link 的 media 表达 浅色/深色/自动
  function isDarkMode() {
    const darkLink = document.querySelector("link.dark-scheme");
    if (!darkLink) return false; // 站点未启用深色配色
    if (darkLink.media === "all") return true; // 用户强制深色
    if (darkLink.media === "none") return false; // 用户强制浅色
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches; // 自动：跟随系统
    } catch {
      return false;
    }
  }

  function applyColorMode() {
    document.documentElement.classList.toggle(DARK_CLASS, isDarkMode());
  }

  function makeSidebarSearch() {
    const container = document.querySelector(".sidebar-container");
    if (!container || container.querySelector(".lark-sidebar-search")) return;

    const search = document.createElement("a");
    search.className = "lark-sidebar-search";
    search.href = "/search";
    search.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2"/>
        <path d="m16 16 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>搜索</span>`;

    const sections = container.querySelector(".sidebar-sections") || container.firstElementChild;
    if (sections) container.insertBefore(search, sections);
    else container.prepend(search);
  }

  function makeHomeHeading() {
    const headerContents = document.querySelector(".d-header .contents");
    if (!headerContents) return;

    let heading = document.querySelector(".lark-home-heading");
    if (!heading) {
      heading = document.createElement("h1");
      heading.className = "lark-home-heading";
      heading.textContent = "主页";
    }
    if (heading.parentElement !== headerContents) headerContents.appendChild(heading);
  }

  function makeCreateTopicButton() {
    const controlsRoot = document.querySelector(".navigation-container, .list-controls");
    if (!controlsRoot) return;

    const candidates = [
      ".navigation-container .create-topic",
      ".navigation-controls .create-topic",
      ".navigation-container #create-topic",
      ".navigation-controls #create-topic",
      ".navigation-container button[title*='新建话题']",
      ".navigation-container button[aria-label*='新建话题']",
      ".list-controls button[title*='新建话题']",
      ".list-controls button[aria-label*='新建话题']"
    ];
    let button = document.querySelector(candidates.join(", "));
    if (!button) {
      button = [...controlsRoot.querySelectorAll("button")].find((node) => {
        const label = [
          node.textContent,
          node.title,
          node.getAttribute("aria-label")
        ]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+/g, " ");
        return label.includes("新建话题");
      });
    }
    if (!button) return;

    button.classList.add("lark-create-topic");
    button.setAttribute("aria-label", "新建话题");
    button.title = "新建话题";

    const navigationContainer = document.querySelector(".navigation-container");
    if (!navigationContainer) return;
    let slot = navigationContainer.querySelector(":scope > .lark-create-topic-slot");
    if (!slot) {
      slot = document.createElement("div");
      slot.className = "lark-create-topic-slot";
      navigationContainer.appendChild(slot);
    }
    if (button.parentElement !== slot) slot.appendChild(button);

    for (const legacySlot of navigationContainer.querySelectorAll(
      ".nav-pills > .lark-create-topic-slot"
    )) {
      legacySlot.remove();
    }

  }

  function makeTopicContext() {
    const headerContents = document.querySelector(".d-header .contents");
    if (!headerContents) return;

    const topicTitle = document.querySelector("#topic-title h1, #topic-title .fancy-title");
    let title = topicTitle?.textContent?.trim().replace(/\s+/g, " ");
    if (!title) {
      // 跳转到中间楼层时 #topic-title 尚未渲染，回退到 tab 标签标题
      title = document.title.replace(/\s*[-–]\s*Linux DO\s*$/, "").trim();
    }
    if (!title) return;

    let context = headerContents.querySelector(".lark-topic-context");
    if (!context) {
      context = document.createElement("div");
      context.className = "lark-topic-context";
      headerContents.appendChild(context);
    }

    const routeKey = `${location.pathname}|${title}`;
    if (context.dataset.routeKey === routeKey) return;
    context.dataset.routeKey = routeKey;

    const category = document.querySelector(
      "#topic-title .badge-category__name, #topic-title .badge-wrapper, #topic-title .category-name"
    );
    const categoryText = category?.textContent?.trim().replace(/\s+/g, " ") || "知识库";
    context.replaceChildren();

    const crumbs = document.createElement("div");
    crumbs.className = "lark-topic-crumbs";
    crumbs.textContent = `知识库  ›  ${categoryText}  ›  ${title}`;

    const meta = document.createElement("div");
    meta.className = "lark-topic-meta";
    meta.textContent = "内部使用　｜　云端实时保存";

    context.append(crumbs, meta);
  }

  function makeColumnLabels() {
    const labels = [
      ["th.default, th.main-link", "标题"],
      ["th.posters", "所有者"],
      ["th.posts", "回复"],
      ["th.views", "浏览量"],
      ["th.activity", "最近访问 ↓"]
    ];

    for (const [selector, label] of labels) {
      for (const cell of document.querySelectorAll(`.topic-list-header ${selector}`)) {
        let span = cell.querySelector(":scope > .lark-column-label");
        if (!span) {
          span = document.createElement("span");
          span.className = "lark-column-label";
          cell.prepend(span);
        }
        if (span.textContent !== label) span.textContent = label;
      }
    }
  }


  function applyTheme() {
    injectStyle();
    document.documentElement.classList.add("lark-doc-theme");
    applyColorMode();
    if (!document.body) return;

    const isTopic = /^\/t\//.test(location.pathname);
    document.documentElement.classList.toggle(HOME_CLASS, !isTopic);
    document.documentElement.classList.toggle(TOPIC_CLASS, isTopic);
    document.body.classList.toggle(HOME_CLASS, !isTopic);
    document.body.classList.toggle(TOPIC_CLASS, isTopic);

    makeBrand();
    makeFavicon();
    makeSidebarSearch();

    const homeHeading = document.querySelector(".lark-home-heading");
    const topicContext = document.querySelector(".lark-topic-context");
    if (isTopic) {
      homeHeading?.remove();
      makeTopicContext();
    } else {
      topicContext?.remove();
      makeHomeHeading();
      makeCreateTopicButton();
      makeColumnLabels();
    }
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyTheme();
    });
  }

  function bootstrap() {
    if (!document.documentElement) {
      setTimeout(bootstrap, 0);
      return;
    }

    injectStyle();
    document.documentElement.classList.add("lark-doc-theme");
    applyColorMode();

    try {
      localStorage.removeItem("lark-doc-theme-mode"); // 清理旧版手动切换的遗留设置
      const colorMedia = window.matchMedia("(prefers-color-scheme: dark)");
      const onColorChange = () => applyColorMode();
      if (colorMedia.addEventListener) {
        colorMedia.addEventListener("change", onColorChange);
      } else if (colorMedia.addListener) {
        colorMedia.addListener(onColorChange);
      }
    } catch {}

    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    for (const method of ["pushState", "replaceState"]) {
      const original = history[method];
      history[method] = function (...args) {
        const result = original.apply(this, args);
        scheduleApply();
        return result;
      };
    }

    window.addEventListener("popstate", scheduleApply);
    window.addEventListener("hashchange", scheduleApply);
    document.addEventListener("DOMContentLoaded", scheduleApply, { once: true });
    document.addEventListener("turbo:load", scheduleApply);
    document.addEventListener("page:changed", scheduleApply);
    scheduleApply();
  }

  bootstrap();
})();
