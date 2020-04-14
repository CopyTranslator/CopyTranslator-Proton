import { Rule } from "./rule";
import { Identifier, mapToObj } from "./types";
const fs = require("fs");
import { compatible } from "../core/constant";
type Rules = Map<Identifier, Rule>; //类型别名
import { resetStyle } from "./style";
import { resetGlobalShortcuts, resetLocalShortcuts } from "./shortcuts";
import store, { getConfigByKey, Config } from "../store";

export function resetAllConfig() {
  resetLocalShortcuts();
  resetGlobalShortcuts();
  resetStyle();
}

class ConfigParser {
  rules: Rules = new Map<Identifier, Rule>();
  file: string | undefined;

  constructor() {}

  config(): Config {
    return store.state.config;
  }

  keys() {
    return store.getters.keys;
  }

  setRule(key: Identifier, rule: Rule) {
    this.rules.set(key, rule);
  }

  getRule(key: Identifier): Rule {
    return <Rule>this.rules.get(key);
  }

  get(key: Identifier) {
    return getConfigByKey(key);
  }

  set(key: Identifier, value: any, needCheck: boolean = true) {
    if (needCheck && !this.checkValid(key, value)) {
      return false;
    }
    store.dispatch("updateConfig", { [key]: value });
    return true;
  }

  checkValid(key: Identifier, value: any): boolean {
    let check = this.getRule(key).check;
    if ((check && !check(value)) || value == undefined) {
      return false;
    }
    return true;
  }

  getTooltip(key: Identifier) {
    return this.getRule(key).msg;
  }

  load(fileName: string): boolean {
    let status = true;
    try {
      let values = JSON.parse(fs.readFileSync(fileName));
      if (!values["version"] || !compatible(values["version"])) {
        throw "version incompatible, configs have been reset";
      }
      let config: Config = {};
      for (const key of this.rules.keys()) {
        let val = values[key];
        if (!this.checkValid(key, val)) {
          //无效的话，就置为默认值
          val = this.getRule(key).predefined;
        }
        config[key] = val;
      }
      store.dispatch("setConfig", config);
      this.save(fileName);
    } catch (e) {
      resetAllConfig();
      this.restoreDefault(fileName);
      status = false;
    }
    return status;
  }

  restoreDefault(fileName: string) {
    for (const [key, rule] of this.rules) {
      this.set(key, rule.predefined);
    }
    this.save(fileName);
  }

  save(fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(store.state.config, null, 4));
  }
}

export { ConfigParser };
