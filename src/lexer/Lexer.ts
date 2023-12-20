import {Token} from "./Token";
import {ReservedKeywordsList, TokenType} from "../consts";

type LexerTokenPattern = {
    type: string;
    pattern: string | RegExp;
}

const g_kRules: LexerTokenPattern[] = [{
    type: "numeric_literal",
    pattern: /[0-9_]+(?:\.[0-9_]+)?/
}]

/**
 * JavaScript Lexer
 */
export class Lexer {

    private readonly originalContent: string;
    private content = "";
    private position = 0;
    private tokens: Token[] = [];
    private lastParsedToken?: Token;
    private lastType = "";


    constructor(content: string) {
        this.originalContent = content;
        this.originalContent = this.originalContent.replace(/\r\n/g, "\n");
        this.reset();
    }

    public reset() {
        this.content = this.originalContent;
        this.position = 0;
    }

    public generate() {

        let token: string | null;
        while (token = this.read()) {

        }
    }

    private fullMatch(token: string, regex: RegExp) {
        regex = new RegExp(`^(?:${regex.source})$`);
        return !!token.match(regex);
    }

    private tokenize(type: TokenType, content: string) {
        const token = new Token(type, content);

        if (this.lastParsedToken) {
            this.lastParsedToken.next = token;
            token.prev = this.lastParsedToken;
        }

        this.lastParsedToken = token;
        this.lastType = token.type;
        this.tokens.push(token);
    }


    private read() {
        const match = this.content.match(LEXER_REGEX_MATCH);
        if (!match) return null;

        const token = match[1];
        this.content = this.content.slice(token.length);
        return token;
    }
}