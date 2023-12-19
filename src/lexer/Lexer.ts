import {Token} from "./Token";
import {ReservedKeywordsList, TokenType} from "../consts";


const PATTERN_WORD = /\w+/;
const PATTERN_WHITESPACE = /\s/;
const PATTERN_SYMBOL = /./;
const PATTERN_NUMERIC = /[0-9_]+(?:\.[0-9_]+)?/;

const PATTERN_LIST = [
    PATTERN_NUMERIC,
    PATTERN_WORD,
    PATTERN_WHITESPACE,
    PATTERN_SYMBOL
];

const LEXER_REGEX_MATCH = new RegExp(`^(${PATTERN_LIST.map(x => `(?:${x.source})`).join("|")})`);

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

            // Symbols indicating the end of a specific program line.
            if (['\n', ';'].includes(token)) {
                this.tokenize('EOL', token);
                continue;
            }

            // Reserved keyword.
            if (ReservedKeywordsList.includes(token)) {
                this.tokenize("reserved", token);
                continue;
            }

            // Empty whitespace tokens.
            if (this.fullMatch(token, PATTERN_WHITESPACE)) {
                this.tokenize("whitespace", token);
                continue;
            }

            if (this.fullMatch(token, PATTERN_NUMERIC)) {
                this.tokenize("numeric", token);
                continue;
            }
        }

        console.log(this.tokens.map(x => x.toString()).join("\n"));
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