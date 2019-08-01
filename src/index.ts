import marked from "marked";

import WikiMarkupRenderer from "./wikiMarkupRenderer";

const renderer = new WikiMarkupRenderer();

export const markdownToWikiSyntax = (markdown: string): string => {
  return marked(markdown, { renderer: renderer });
};
