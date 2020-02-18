import marked from "marked";

import {
  AtlassianWikiMarkupRenderer,
  MarkdownToAtlassianWikiMarkupOptions
} from "./atlassianWikiMarkupRenderer";

export {
  AtlassianWikiMarkupRenderer,
  MarkdownToAtlassianWikiMarkupOptions,
  CodeBlockTheme,
  CodeBlockThemeValues
} from "./atlassianWikiMarkupRenderer";

export {
  AtlassianSupportLanguage,
  AtlassianSupportLanguageValues
} from "./language";

export const markdownToAtlassianWikiMarkup = (
  markdown: string,
  options?: MarkdownToAtlassianWikiMarkupOptions
): string => {
  const renderer = new AtlassianWikiMarkupRenderer(options);
  return marked(markdown, { renderer: renderer });
};
