import {TokenType} from "../consts";

export class Token {

    public type: TokenType;
    public content = "";
    private attributes = new Set<string>();

    next?: Token;
    prev?: Token;

    constructor(type: TokenType, content: string) {
        this.type = type;
        this.content = content;
    }

    toString() {
        return `<${this.type}: ${JSON.stringify(this.content)}>`;
    }

    hasAttribute(attrib: string) {
        return this.attributes.has(attrib)
    }

    addAttribute(attrib: string) {
        this.attributes.add(attrib);
    }

    removeAttribute(attrib: string) {
        this.attributes.delete(attrib);
    }
}
