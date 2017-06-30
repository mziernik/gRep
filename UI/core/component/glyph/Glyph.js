export default class Glyph {
    static ALL: Glyph[] = [];
    className: string;

    constructor(className: string) {
        Glyph.ALL.push(this);
        this.className = className;
    }

    toString() {
        return this.className;
    }
}