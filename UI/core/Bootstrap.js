export const MODULES: Map<string, () => void> = new Map();
const NAMES: string[] = [];
const LISTENERS: [] = [];

let loaded = false;

class Module {
    name: string;
    module: any;
    created: Date = new Date();
}

window._registerModule = function (name: string, module) {

    const mod: Module = new Module();
    mod.name = name;
    mod.module = module;

    MODULES.set(name, mod);
    NAMES.push(name);

    const toRemove = [];

    LISTENERS.forEach((arr, idx) => {
        if (NAMES.find(name => name === arr[0])) {
            try {
                arr[1](mod);
            } catch (e) {
                console.error(e);
            }
            toRemove.push(arr);
        }
    });


    if (!toRemove.length) return;
    toRemove.forEach(elm => LISTENERS.remove(elm));

};


export function onCoreReady(callback: () => void): boolean {
    return onReady("core/core.js", callback);
}

export function onReady(fileName: string, callback: () => void): boolean {
    const result = NAMES.find(name => name === fileName);
    if (result) {
        callback();
        return true;
    }

    if (loaded)
        throw new Error("Wszystkie moduły zostały już załadowane. Prawdopodobnie nazwa pliku \"" + fileName
            + "\" jest nieprawidłowa lub moduł nie został nigdzie zaimportowany");

    LISTENERS.push([fileName, callback]);
    return false
}


window.addEventListener("load", () => {
    loaded = true;
    if (!LISTENERS.length) return;
    debugger;

    const names = [];
    LISTENERS.forEach(arr => {
        const n = '"' + arr[0] + '"';
        if (names.indexOf(n) === -1)
            names.push(n);
    });

    throw new Error("Poniższe moduły nie zostały już załadowane (prawdopodobnie nazwa pliku jest " +
        "nieprawidłowa lub moduł nie został nigdzie zaimportowany):\n" + names.join("\n"));

});