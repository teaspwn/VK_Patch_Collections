// ==UserScript==
// @name         VK Config editor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       .teaspwn
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @run-at       document-start
// @grant        none
// ==/UserScript==
// Attributes to remove from <html>
const ATTRS = [];

// Experiment flags.
const EXPFLAGS = {
    new_sticker_picker: false,
};

class VKC {
    static observer = new MutationObserver(this.onNewScript);

    static pe = {};

    static isObject(item) {
        return (item && typeof item === "object" && !Array.isArray(item));
    }

    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.mergeDeep(target, ...sources);
    }


    static onNewScript(mutations) {
        for (var mut of mutations) {
            for (var node of mut.addedNodes) {
                VKC.bruteforce();
            }
        }
    }

    static start() {
        this.observer.observe(document, {childList: true, subtree: true});
    }

    static stop() {
        this.observer.disconnect();
    }

    static bruteforce() {
        if (!window.vk) return;
        if (!window.vk.pe) return;

        this.mergeDeep(window.vk.pe, this.pe);
    }

    static setCfg(name, value) {
        this._config[name] = value;
    }

    static setExp(name, value) {
        if (!("pe" in this.pe)) this.pe = {};

        this.pe[name] = value;
    }

    static setExpMulti(exps) {
        if (!("pe" in this.pe)) this.pe = {};

        this.mergeDeep(this.pe, exps);
    }
}

VKC.start();
VKC.setExpMulti(EXPFLAGS);
