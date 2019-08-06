import escapeStringRegexp from "escape-string-regexp";
import { Renderer, Slugger } from "marked";

import {
  AtlassianSupportLanguage,
  markdownToWikiMarkupLanguageMapping
} from "./language";

export enum CodeBlockTheme {
  DJango = "DJango",
  Emacs = "Emacs",
  FadeToGrey = "FadeToGrey",
  Midnight = "Midnight",
  RDark = "RDark",
  Eclipse = "Eclipse",
  Confluence = "Confluence"
}

export class MarkdownToAtlassianWikiMarkupOptions {
  public codeBlockTheme?: CodeBlockTheme;
  public showCodeBlockLineNumbers?:
    | boolean
    | ((code: string, lang: AtlassianSupportLanguage) => boolean);
  public collapse?:
    | boolean
    | ((code: string, lang: AtlassianSupportLanguage) => boolean);

  public constructor(params: {
    codeBlock?: {
      theme?: CodeBlockTheme;
      showLineNumbers?:
        | boolean
        | ((code: string, lang: AtlassianSupportLanguage) => boolean);
      collapse?:
        | boolean
        | ((code: string, lang: AtlassianSupportLanguage) => boolean);
    };
  }) {
    this.codeBlockTheme =
      (params.codeBlock && params.codeBlock.theme) || undefined;
    this.showCodeBlockLineNumbers =
      (params.codeBlock && params.codeBlock.showLineNumbers) || undefined;
    this.collapse =
      (params.codeBlock && params.codeBlock.collapse) || undefined;
  }
}

enum ListHeadCharacter {
  Numbered = "#",
  Bullet = "*"
}

enum TableCellTypeCharacter {
  Header = "||",
  NonHeader = "|"
}

const atlassianSupportLanguageList = Object.values(AtlassianSupportLanguage);
const atlassianSupportLanguageReduceInitialValue: {
  [key: string]: string;
} = {};
const convertingSupportLanguageMapping = Object.assign(
  markdownToWikiMarkupLanguageMapping,
  atlassianSupportLanguageList.reduce((previousValue, currentValue): {
    [key: string]: string;
  } => {
    previousValue[currentValue] = currentValue;
    return previousValue;
  }, atlassianSupportLanguageReduceInitialValue)
);
const confluenceListRegExp = new RegExp(
  `^(${Object.values(ListHeadCharacter)
    .map(escapeStringRegexp)
    .join("|")})`
);

const unescapeHtmlSpecialCharacteres = (text: string): string => {
  return text.replace(
    /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,
    (substring: string, matchedString: string): string => {
      const lowered = matchedString.toLowerCase();
      if (lowered === "colon") {
        return ":";
      }

      if (lowered === "amp") {
        return "&";
      }

      if (lowered === "lt") {
        return "<";
      }

      if (lowered === "gt") {
        return ">";
      }

      if (lowered === "quot") {
        return "\"";
      }

      if (lowered.charAt(0) === "#" && lowered.charAt(1) === "x") {
        String.fromCharCode(parseInt(lowered.substring(2), 16));
      }

      if (lowered.charAt(0) === "#" && lowered.charAt(1) !== "x") {
        String.fromCharCode(Number(lowered.substring(1)));
      }

      return substring;
    }
  );
};

export class AtlassianWikiMarkupRenderer extends Renderer {
  private rendererOptions?: MarkdownToAtlassianWikiMarkupOptions;

  public constructor(rendererOptions?: MarkdownToAtlassianWikiMarkupOptions) {
    super();
    this.rendererOptions = rendererOptions;
  }

  public paragraph(text: string): string {
    const unescapedText = unescapeHtmlSpecialCharacteres(text);
    return `${unescapedText}\n\n`;
  }

  public heading(
    text: string,
    level: number,
    _raw: string,
    _slugger: Slugger
  ): string {
    return `h${level}. ${text}\n\n`;
  }

  public strong(text: string): string {
    return `*${text}*`;
  }

  public em(text: string): string {
    return `_${text}_`;
  }

  public del(text: string): string {
    return `-${text}-`;
  }

  public codespan(text: string): string {
    return `{{${text}}}`;
  }

  public blockquote(quote: string): string {
    return `{quote}${quote.trim()}{quote}`;
  }

  public br(): string {
    return "\n";
  }

  public hr(): string {
    return "----\n";
  }

  public link(href: string, title: string | null, text: string): string {
    const linkAlias = text || title;

    return linkAlias ? `[${linkAlias}|${href}]` : `[${href}]`;
  }

  public list(body: string, ordered: boolean, _start: number | ""): string {
    const lines = body
      .trim()
      .split("\n")
      .filter((line): boolean => !!line);
    const type = ordered
      ? ListHeadCharacter.Numbered
      : ListHeadCharacter.Bullet;
    const joinedLine = lines
      .map((line): string => {
        return line.match(confluenceListRegExp)
          ? `${type}${line}`
          : `${type} ${line}`;
      })
      .join("\n");

    return `\n${joinedLine}\n`;
  }

  public listitem(body: string): string {
    return `${body}\n`;
  }

  public checkbox(_checked: boolean): string {
    // Confluence wiki does not support checkbox.
    return "";
  }

  public image(href: string, title: string | null, text: string): string {
    const params = {
      alt: text,
      title: title
    };
    const paramsString = Object.entries(params)
      .filter(([, value]): boolean => {
        return value !== null && value.trim() !== "";
      })
      // Sort by key to prevent the order from changing in the way of defining params
      .sort((a, b): number => (a[0] > b[0] ? 1 : -1))
      .map(([key, value]): string => `${key}=${value}`)
      .join(",");

    return paramsString === "" ? `!${href}!` : `!${href}|${paramsString}!`;
  }

  public table(header: string, body: string): string {
    return `\n${header}${body}\n`;
  }

  public tablerow(content: string): string {
    const removedEscapePipe = content.trim().replace("\\|", "");
    const twoPipeMatch = removedEscapePipe.match(/\|\|(?!.*\|\|)/);
    const onePipeMatch = removedEscapePipe.match(/\|(?!.*\|)/);
    const rowCloseType = ((): TableCellTypeCharacter => {
      if (!onePipeMatch || !onePipeMatch.index) {
        throw new Error(
          "The table row expects at least one '|' in the table cell."
        );
      }

      if (twoPipeMatch && twoPipeMatch.index) {
        const indexDiff = onePipeMatch.index - twoPipeMatch.index;
        return indexDiff === 1
          ? TableCellTypeCharacter.Header
          : TableCellTypeCharacter.NonHeader;
      }

      return TableCellTypeCharacter.NonHeader;
    })();

    return `${content}${rowCloseType}\n`;
  }

  public tablecell(
    content: string,
    flags: {
      header: boolean;
      align: "center" | "left" | "right" | null;
    }
  ): string {
    const type = flags.header
      ? TableCellTypeCharacter.Header
      : TableCellTypeCharacter.NonHeader;

    return `${type}${content}`;
  }

  public code(code: string, language: string, _isEscaped: boolean): string {
    const theme =
      (this.rendererOptions && this.rendererOptions.codeBlockTheme) ||
      CodeBlockTheme.Confluence;

    const usingLang =
      convertingSupportLanguageMapping[language.toLowerCase()] ||
      AtlassianSupportLanguage.None;

    const isDisplayLinenumbers = ((): boolean => {
      const defaultValue = false;
      if (!this.rendererOptions) {
        return defaultValue;
      }

      if (this.rendererOptions.showCodeBlockLineNumbers instanceof Function) {
        return this.rendererOptions.showCodeBlockLineNumbers(code, usingLang);
      }

      return this.rendererOptions.showCodeBlockLineNumbers || defaultValue;
    })();

    const isCollapseCodeBlock = ((): boolean => {
      const defaultValue = false;
      if (!this.rendererOptions) {
        return defaultValue;
      }

      if (this.rendererOptions.collapse instanceof Function) {
        return this.rendererOptions.collapse(code, usingLang);
      }

      return this.rendererOptions.collapse || defaultValue;
    })();

    const params = {
      language: usingLang,
      theme: theme,
      linenumbers: isDisplayLinenumbers,
      collapse: isCollapseCodeBlock
    };
    const paramsString = Object.entries(params)
      // Sort by key to prevent the order from changing in the way of defining params
      .sort((a, b): number => (a[0] > b[0] ? 1 : -1))
      .map(([key, value]): string => `${key}=${value}`)
      .join("|");

    return `{code:${paramsString}}\n${code}\n{code}\n\n`;
  }
}
