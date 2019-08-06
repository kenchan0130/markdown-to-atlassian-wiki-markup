import marked from "marked";

import {
  AtlassianWikiMarkupRenderer,
  CodeBlockTheme
} from "./atlassianWikiMarkupRenderer";
import { AtlassianSupportLanguage } from "./language";

export class MarkdownToAtlassianWikiMarkupOptions {
  public codeBlockTheme?: CodeBlockTheme;
  public showCodeBlockLineNumber?:
    | boolean
    | ((code: string, lang: AtlassianSupportLanguage) => boolean);
  public collapse?:
    | boolean
    | ((code: string, lang: AtlassianSupportLanguage) => boolean);

  public constructor(params: {
    codeBlock?: {
      theme?: CodeBlockTheme;
      showLineNumber?:
        | boolean
        | ((code: string, lang: AtlassianSupportLanguage) => boolean);
      collapse?:
        | boolean
        | ((code: string, lang: AtlassianSupportLanguage) => boolean);
    };
  }) {
    this.codeBlockTheme =
      (params.codeBlock && params.codeBlock.theme) || undefined;
    this.showCodeBlockLineNumber =
      (params.codeBlock && params.codeBlock.showLineNumber) || undefined;
    this.collapse =
      (params.codeBlock && params.codeBlock.collapse) || undefined;
  }
}

export const markdownToAtlassianWikiMarkup = (
  markdown: string,
  options?: MarkdownToAtlassianWikiMarkupOptions
): string => {
  const renderer = new AtlassianWikiMarkupRenderer(options);
  return marked(markdown, { renderer: renderer });
};
