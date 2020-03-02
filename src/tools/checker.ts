import { raceGet } from "./network";
import { versionString, constants } from "../core/constant";
import { dialog, nativeImage, shell, BrowserWindow } from "electron";
import { env } from "./env";

type Button = {
  label: string;
  ref: string;
};

type Notice = {
  message: string;
  id: string;
  buttons: Array<Button>;
};

export function checkUpdate() {
  raceGet("/version.json")
    .then(res => {
      if (res && res.data.version > versionString) {
        const info = res.data;
        const mirror = info.mirrors[res.key];
        const controller = global.controller;
        const t = controller.getT();
        dialog
          .showMessageBox(<BrowserWindow>controller.win.window, {
            title: "A newer version is available " + info.version,
            message: info.abstract,
            buttons: [t("toDownload"), t("changelog"), t("cancel")],
            icon: nativeImage.createFromPath(env.iconPath),
            cancelId: 2
          })
          .then(res => res.response)
          .then(response => {
            switch (response) {
              case 0:
                shell.openExternal(mirror.installUrl);
                break;
              case 1:
                shell.openExternal(mirror.changelog);
                break;
            }
          });
      }
    })
    .catch(e => {
      console.log(e);
    });
}

export function checkNotice() {
  const controller = global.controller;
  const t = controller.getT();
  let notices = controller.get<Notice[]>("notices");
  function getButtons(buttons: Array<Button>) {
    let new_buttons = buttons.map(button => button.label);
    new_buttons.push(t("ok"));
    return new_buttons;
  }
  raceGet("/notice.json")
    .then(res => {
      if (res && notices.indexOf(res.data.id) == -1) {
        notices.push(res.data.id);
        controller.set("notices", notices);
        const notice = <Notice>res.data;
        if (!notice.buttons) notice.buttons = [];
        const buttons = getButtons(notice.buttons);
        dialog
          .showMessageBox(<BrowserWindow>controller.win.window, {
            title: versionString,
            message: notice.message,
            buttons: buttons,
            cancelId: buttons.length - 1,
            icon: nativeImage.createFromPath(env.iconPath)
          })
          .then(res => res.response)
          .then(response => {
            shell.openExternal(notice.buttons[response].ref);
          });
      }
    })
    .catch(e => {
      console.log(e);
    });
}
