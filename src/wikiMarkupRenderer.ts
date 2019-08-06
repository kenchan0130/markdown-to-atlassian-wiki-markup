import escapeStringRegexp from "escape-string-regexp";
import { Renderer, Slugger } from "marked";

import {
  AtlassianSupportLanguage,
  markdownToWikiMarkupLanguageMapping
} from "./language";

enum CodeBlockTheme {
  DJango = "DJango",
  Emacs = "Emacs",
  FadeToGrey = "FadeToGrey",
  Midnight = "Midnight",
  RDark = "RDark",
  Eclipse = "Eclipse",
  Confluence = "Confluence"
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

export default class WikiMarkupRenderer extends Renderer {
  public paragraph(text: string): string {
    const unescapedText = unescapeHtmlSpecialCharacteres(text);
    return `${unescapedText}\n\n`;
  }

  public heading(
    text: string,
    level: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    raw: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    slugger: Slugger
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public list(body: string, ordered: boolean, start: number | ""): string {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public checkbox(checked: boolean): string {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public code(code: string, language: string, isEscaped: boolean): string {
    const adjustedLang = language ? language.toLowerCase() : language;
    const params = {
      language:
        convertingSupportLanguageMapping[adjustedLang] ||
        AtlassianSupportLanguage.None,
      theme: CodeBlockTheme.Confluence,
      linenumbers: true,
      collapse: false
    };
    const paramsString = Object.entries(params)
      // Sort by key to prevent the order from changing in the way of defining params
      .sort((a, b): number => (a[0] > b[0] ? 1 : -1))
      .map(([key, value]): string => `${key}=${value}`)
      .join("|");

    return `{code:${paramsString}}\n${code}\n{code}\n\n`;
  }
}
