import {Lexer} from "./Lexer";

type LexerRuleToken = string | LexerRule;

export class LexerRule {
    public static fromRegex(regex: RegExp) {
        return new RegexLexerRule(regex);
    }

    public static fromGrammar(...tokens: LexerRuleToken[]) {

    }

    public static range() {

    }

    public static oneOf(values: string[]) {

    }

    protected compile() {

    }
}

class GrammarLexerRule extends LexerRule {
    tokens: LexerRuleToken[] = [];

    constructor(...tokens: LexerRuleToken[]) {
        super();

        this.tokens = tokens;
    }
}

class RegexLexerRule extends LexerRule {
    regex: RegExp;

    constructor(regex: RegExp) {
        super();
        this.regex = regex;
    }

    protected compile() {
        return this.regex.source;
    }
}