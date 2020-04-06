//以下是做一个特定的事的动作
export const normalActionTypes = [
  "translate", //翻译
  "copySource", //复制原文
  "copyResult", //复制译文
  "clear", //清空
  "helpAndUpdate",
  "exit",
  "viewSource",
  "return",
  "retryTranslate",
  "evaluate",
  "homepage",
  "userManual",
  "checkUpdate",
  "toDownload",
  "changelog",
  "cancel",
  "ok",
  "restoreDefault",
  "capture",
  "notices",
  "font+",
  "font-"
] as const;

//切换值的动作
export const constantActionTypes = [
  "source",
  "result",
  "localeName",
  "sourceLanguage",
  "targetLanguage",
  "localeSetting",
  "hideDirect",
  "translatorType",
  "dictionaryType",
  "layoutType",
  "frameMode",
  "version",
  "API_KEY",
  "APP_ID",
  "SECRET_KEY"
] as const;

//切换值的动作
export const switchActionTypes = [
  "skipTaskbar",
  "stayTop",
  "listenClipboard",
  "autoCopy",
  "autoPaste",
  "autoPurify",
  "neverShow",
  "smartDict",
  "autoHide",
  "autoFormat",
  "autoShow",
  "incrementalCopy",
  "enableNotify",
  "smartTranslate",
  "smartDict",
  "dragCopy",
  "closeAsQuit"
] as const;

//Electron 原生 角色
export const roles = [
  "undo",
  "redo",
  "cut",
  "copy",
  "paste",
  "pasteAndMatchStyle",
  "selectAll",
  "delete",
  "minimize",
  "close",
  "quit",
  "reload",
  "forceReload",
  "toggleDevTools",
  "togglefullscreen",
  "resetZoom",
  "zoomIn",
  "zoomOut",
  "editMenu",
  "windowMenu"
] as const;

//不同位置动作列表
export const menuActionTypes = [
  "contrastPanel", //面板上显示的
  "contrastContext", //上下文
  "focusContext", //上下文
  "focusRight", // 按钮右键
  "switches", //设置的开关面板
  "options", //设置的选项面板
  "ocrConfig", //设置的配置面板
  "tray", //任务栏托盘右键菜单
  "draggableOptions", //
  "allActions"
] as const;

//布局名称
export const layoutTypes = ["horizontal", "vertical", "focus"] as const;

//路由名称
export const routeActionTypes = [
  "contrast",
  "settings", //设置页面
  "update",
  "menuDrag"
] as const;

export type Role = typeof roles[number];
export type SwitchActionType = typeof switchActionTypes[number];
export type ConstantActionType = typeof constantActionTypes[number];
export type NormalActionType = typeof normalActionTypes[number];
export type MenuActionType = typeof menuActionTypes[number];
export type RouteActionType = typeof routeActionTypes[number];
export type LayoutType = typeof layoutTypes[number];

export const authorizeKey: string = "CopyTranslator";
import flatten from "lodash.flatten";

export type Identifier =
  | RouteActionType
  | LayoutType
  | NormalActionType
  | MenuActionType
  | SwitchActionType
  | ConstantActionType
  | Role;

export const identifiers: readonly Identifier[] = flatten([
  roles,
  switchActionTypes,
  constantActionTypes,
  normalActionTypes,
  menuActionTypes,
  routeActionTypes,
  layoutTypes
]);

export function mapToObj<T>(strMap: Map<Identifier, T>): { [key: string]: T } {
  let obj = Object.create({});
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

export function objToMap<T>(obj: { [key: string]: T }): Map<Identifier, T> {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
