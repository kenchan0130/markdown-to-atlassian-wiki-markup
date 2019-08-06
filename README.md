# @kenchan0130/markdown-to-atlassian-wiki-markup

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![dep][dep-image]][dev-dep-url]
[![dev dep][dev-dep-image]][dev-dep-url]
[![snyk][snyk-image]][snyk-url]
[![MIT][mit-image]][mit-url]

[npm-image]: https://img.shields.io/npm/v/@kenchan0130/markdown-to-atlassian-wiki-markup.svg
[npm-url]: https://www.npmjs.com/package/@kenchan0130/markdown-to-atlassian-wiki-markup

[travis-image]: https://badgen.net/travis/kenchan0130/markdown-to-atlassian-wiki-markup
[travis-url]: https://travis-ci.org/kenchan0130/markdown-to-atlassian-wiki-markup

[dep-image]: https://badgen.net/david/dep/kenchan0130/markdown-to-atlassian-wiki-markup?label=deps
[dep-url]: https://david-dm.org/kenchan0130/markdown-to-atlassian-wiki-markup

[dev-dep-image]: https://badgen.net/david/dep/kenchan0130/markdown-to-atlassian-wiki-markup?label=devDeps
[dev-dep-url]: https://david-dm.org/kenchan0130/markdown-to-atlassian-wiki-markup?type=dev

[snyk-image]: https://snyk.io/test/npm/@kenchan0130/markdown-to-atlassian-wiki-markup/badge.svg
[snyk-url]: https://snyk.io/test/npm/@kenchan0130/markdown-to-atlassian-wiki-markup

[mit-image]: https://badgen.net/npm/license/@kenchan0130/markdown-to-atlassian-wiki-markup
[mit-url]: https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup/blob/master/LICENSE

Convert markdown to atlassian wiki markup

## Installation

```sh
npm install @kenchan0130/markdown-to-atlassian-wiki-markup
# or
yarn add @kenchan0130/markdown-to-atlassian-wiki-markup
```

## Usage

```js
// ES5
const markdownToAtlassianWikiMarkup = require("@kenchan0130/markdown-to-atlassian-wiki-markup");

// TypeScript
import { markdownToAtlassianWikiMarkup } from "@kenchan0130/markdown-to-atlassian-wiki-markup";
```

```js
const wikiMarkup = markdownToAtlassianWikiMarkup("# Heading 1\n- list");
console.log(wikiMarkup);
/**
h1. Heading

* list

**/
```

### Options

You can use `MarkdownToAtlassianWikiMarkupOptions`.
It has following properties.

namespace|key|type|description
---|---|---|---
codeBlock|theme|`CodeBlockTheme` or `string`|Theme of code block.<br>See also: https://confluence.atlassian.com/doc/code-block-macro-139390.html
codeBlock|showLineNumbers|`boolean` or `(code: string, lang: AtlassianSupportLanguage) => boolean` function or `(code: string, lang: string) => boolean` function |Show or not linenumbers of code block.
codeBlock|collapse|`boolean` or `(code: string, lang: AtlassianSupportLanguage) => boolean` function or `(code: string, lang: string) => boolean` function|Enable or not collapse of code block.


```typescript
import { AtlassianSupportLanguage, CodeBlockTheme, MarkdownToAtlassianWikiMarkupOptions } from "@kenchan0130/markdown-to-atlassian-wiki-markup";

const options = new MarkdownToAtlassianWikiMarkupOptions({
  codeBlock: {
    theme: CodeBlockTheme.DJango,
    showLineNumbers: true,
    collapse: true
  }
});
const wikiMarkup = markdownToAtlassianWikiMarkup("# Heading 1\n- list", options);
console.log(wikiMarkup);
```

```typescript
import { AtlassianSupportLanguage, CodeBlockTheme, MarkdownToAtlassianWikiMarkupOptions } from "@kenchan0130/markdown-to-atlassian-wiki-markup";

const options = new MarkdownToAtlassianWikiMarkupOptions({
  codeBlock: {
    theme: CodeBlockTheme.DJango,
    // In this case, it does not display line numbers when the code lang is none.
    showLineNumbers: (
      code: string,
      _lang: AtlassianSupportLanguage
    ): boolean => lang !== AtlassianSupportLanguage.None,
    // In this case, it makes code block collapsed when the code line number more than 10.
    collapse: (
      _code: string,
      lang: AtlassianSupportLanguage
    ): boolean => code.split("\n").length > 10,
  }
});
const wikiMarkup = markdownToAtlassianWikiMarkup("# Heading 1\n- list", options);
console.log(wikiMarkup);
```

## About Markdown

Markdown has various dialects.

This library uses [marked](https://github.com/markedjs/marked).
Therefore, it supports [GitHub Flavored Markdown](https://github.github.com/gfm/).

## Development

### Test

```sh
npm run test
```

### Contributing

1. Fork the project
2. Create a descriptively named feature branch
3. Add your feature
4. Submit a pull request

### Release

```sh
npm version major|minor|patch
```

Run this with local master branch.

## License

MIT
