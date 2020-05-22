# @kenchan0130/markdown-to-atlassian-wiki-markup

[![NPM version][npm-image]][npm-url]
[![Build status][github-actions-image]][github-actions-url]
[![dep][dep-image]][dev-dep-url]
[![dev dep][dev-dep-image]][dev-dep-url]
[![snyk][snyk-image]][snyk-url]
[![MIT][mit-image]][mit-url]

[npm-image]: https://img.shields.io/npm/v/@kenchan0130/markdown-to-atlassian-wiki-markup.svg
[npm-url]: https://www.npmjs.com/package/@kenchan0130/markdown-to-atlassian-wiki-markup

[github-actions-image]: https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup/workflows/CI/badge.svg
[github-actions-url]: https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup/actions?query=workflow%3A%22CI%22

[dep-image]: https://badgen.net/david/dep/kenchan0130/markdown-to-atlassian-wiki-markup?label=deps
[dep-url]: https://david-dm.org/kenchan0130/markdown-to-atlassian-wiki-markup

[dev-dep-image]: https://badgen.net/david/dep/kenchan0130/markdown-to-atlassian-wiki-markup?label=devDeps
[dev-dep-url]: https://david-dm.org/kenchan0130/markdown-to-atlassian-wiki-markup?type=dev

[snyk-image]: https://snyk.io/test/npm/@kenchan0130/markdown-to-atlassian-wiki-markup/badge.svg
[snyk-url]: https://snyk.io/test/npm/@kenchan0130/markdown-to-atlassian-wiki-markup

[mit-image]: https://badgen.net/npm/license/@kenchan0130/markdown-to-atlassian-wiki-markup
[mit-url]: https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup/blob/master/LICENSE

Convert markdown to atlassian wiki markup

If you want to use this on your command line, you can use [markdown-to-atlassian-wiki-markup-cli](https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup-cli).

## Installation

```sh
npm install @kenchan0130/markdown-to-atlassian-wiki-markup
# or
yarn add @kenchan0130/markdown-to-atlassian-wiki-markup
```

## Usage

### Usage JavaScript

```js
var markdownToAtlassianWikiMarkup = require("@kenchan0130/markdown-to-atlassian-wiki-markup").markdownToAtlassianWikiMarkup;

var wikiMarkup = markdownToAtlassianWikiMarkup("# Heading 1\n- list");
console.log(wikiMarkup);
/**
h1. Heading

* list

**/
```

### Usage TypeScript

```typescript
import { markdownToAtlassianWikiMarkup } from "@kenchan0130/markdown-to-atlassian-wiki-markup";

const wikiMarkup = markdownToAtlassianWikiMarkup("# Heading 1\n- list");
console.log(wikiMarkup);
/**
h1. Heading

* list

**/
```

## Options

You can use `MarkdownToAtlassianWikiMarkupOptions`.
It has following properties.

| namespace | key             | type                                                                                    | description                                                                                                                                                              |
|-----------|-----------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| codeBlock | theme           | `CodeBlockTheme` or `string`                                                            | Theme of code block.<br>See also: [https://confluence.atlassian.com/doc/code-block-macro-139390.html](https://confluence.atlassian.com/doc/code-block-macro-139390.html) |
| codeBlock | showLineNumbers | `boolean` or `(code: string, lang: AtlassianSupportLanguageValues) => boolean` function | Show or not linenumbers of code block.                                                                                                                                   |
| codeBlock | collapse        | `boolean` or `(code: string, lang: AtlassianSupportLanguageValues) => boolean` function | Enable or not collapse of code block.                                                                                                                                    |

### Options JavaScript Example

```js
var markdownToAtlassianWikiMarkup = require("@kenchan0130/markdown-to-atlassian-wiki-markup").markdownToAtlassianWikiMarkup;

var options = {
  codeBlock: {
    theme: "DJango",
    showLineNumbers: true,
    collapse: true
  }
};
var wikiMarkup = markdownToAtlassianWikiMarkup(`
\`\`\`javascript
console.log("This is JavaScript.");
\`\`\`
`, options);
console.log(wikiMarkup);
/*

{code:collapse=true|language=javascript|linenumbers=true|theme=DJango}
console.log("This is JavaScript.");
{code}

*/
```

```js
var markdownToAtlassianWikiMarkup = require("@kenchan0130/markdown-to-atlassian-wiki-markup").markdownToAtlassianWikiMarkup;

const options = {
  codeBlock: {
    theme: "DJango",
    // In this case, it does not display line numbers when the code lang is none.
    showLineNumbers: function(_code, lang) { return lang !== "none"; },
    // In this case, it makes code block collapsed when the code line number more than 10.
    collapse: function(code) { return code.split("\n").length > 10; },
  }
});
var wikiMarkup = markdownToAtlassianWikiMarkup(```
\`\`\`typescript
console.log("This is TypeScript.");
\`\`\`
```, options);
console.log(wikiMarkup);
/*

{code:collapse=false|language=none|linenumbers=false|theme=DJango}
console.log("This is TypeScript.");
{code}

*/
```

### Options TypeScript Example

```typescript
import { AtlassianSupportLanguage, CodeBlockTheme, markdownToAtlassianWikiMarkup, MarkdownToAtlassianWikiMarkupOptions } from "@kenchan0130/markdown-to-atlassian-wiki-markup";

const options = {
  codeBlock: {
    theme: CodeBlockTheme.DJango,
    showLineNumbers: true,
    collapse: true
  }
};
const wikiMarkup = markdownToAtlassianWikiMarkup(`
\`\`\`javascript
console.log("This is JavaScript.");
\`\`\`
`, options);
console.log(wikiMarkup);
/*

{code:collapse=true|language=javascript|linenumbers=true|theme=DJango}
console.log("This is JavaScript.");
{code}

*/
```

```typescript
import { AtlassianSupportLanguage, AtlassianSupportLanguageValues, CodeBlockTheme, markdownToAtlassianWikiMarkup, MarkdownToAtlassianWikiMarkupOptions } from "@kenchan0130/markdown-to-atlassian-wiki-markup";

const options = {
  codeBlock: {
    theme: CodeBlockTheme.DJango,
    // In this case, it does not display line numbers when the code lang is none.
    showLineNumbers: (
      _code: string,
      lang: AtlassianSupportLanguageValues
    ): boolean => lang !== AtlassianSupportLanguage.None,
    // In this case, it makes code block collapsed when the code line number more than 10.
    collapse: (
      code: string,
      _lang: AtlassianSupportLanguageValues
    ): boolean => code.split("\n").length > 10,
  }
});
const wikiMarkup = markdownToAtlassianWikiMarkup(```
\`\`\`typescript
console.log("This is TypeScript.");
\`\`\`
```, options);
console.log(wikiMarkup);
/*

{code:collapse=false|language=none|linenumbers=false|theme=DJango}
console.log("This is TypeScript.");
{code}

*/
```

## About Markdown

Markdown has various dialects.

This library uses [marked](https://github.com/markedjs/marked).
Therefore, it supports [GitHub Flavored Markdown](https://github.github.com/gfm/).

## Development

### Test

```sh
npm ci
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
