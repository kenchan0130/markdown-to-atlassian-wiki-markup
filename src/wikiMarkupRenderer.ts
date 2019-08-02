import {
  AtlassianSupportLanguage,
  markdownToWikiMarkupLanguageMapping
} from "./language";
import { Renderer, Slugger } from "marked";

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

enum CodeBlockTheme {
  DJango = "DJango",
  Emacs = "Emacs",
  FadeToGrey = "FadeToGrey",
  Midnight = "Midnight",
  RDark = "RDark",
  Eclipse = "Eclipse",
  Confluence = "Confluence"
}

export default class WikiMarkupRenderer extends Renderer {
  public paragraph(text: string): string {
    return `${text}\n\n`;
  }

  public html(html: string): string {
    return html;
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

  public link(href: string, title: string, text: string | null): string {
    const linkAlias = text || title;

    return linkAlias ? `[${linkAlias}|${href}]` : `[${href}]`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public list(body: string, ordered: boolean, start: number): string {
    const lines = body
      .trim()
      .split("\n")
      .filter((line): boolean => !!line);
    const type = ordered ? "#" : "*";
    const joinedLine = lines
      .map((line): string => `${type} ${line}`)
      .join("\n");

    return `${joinedLine}\n\n`;
  }

  public listitem(body: string): string {
    return `${body}\n`;
  }

  public image(href: string, title: string, text: string): string {
    const params = {
      title: title,
      alt: text
    };
    const paramsString = Object.entries(params)
      .filter(([, value]): boolean => value.trim() !== "")
      .map(([key, value]): string => `${key}=${value}`)
      .join(",");

    return paramsString === "" ? `!${href}!` : `!${href}|${paramsString}!`;
  }

  public table(header: string, body: string): string {
    return `${header}\n${body}\n`;
  }

  public tablerow(content: string): string {
    return `${content}\n`;
  }

  public tablecell(
    content: string,
    flags: {
      header: boolean;
      align: "center" | "left" | "right" | null;
    }
  ): string {
    const type = flags.header ? "||" : "|";

    return `${type}${content}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public code(code: string, language: string, isEscaped: boolean): string {
    const adjustedLang = language ? language.toLowerCase() : language;
    const params = {
      language: convertingSupportLanguageMapping[adjustedLang] || "none",
      theme: CodeBlockTheme.Confluence,
      linenumbers: true,
      collapse: false
    };
    const paramsString = Object.entries(params)
      .map(([key, value]): string => `${key}=${value}`)
      .join("|");

    return `{code:${paramsString}}\n${code}\n{code}\n\n`;
  }
}
