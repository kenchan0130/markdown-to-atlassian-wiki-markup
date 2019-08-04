# @kenchan0130/markdown-to-atlassian-wiki-markup

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![dep][dep-image]][dev-dep-url]
[![dev dep][dev-dep-image]][dev-dep-url]
[![snyk][snyk-image]][snyk-url]
[![MIT][mit-image]][mit-url]

[npm-image]: https://badgen.net/npm/v/@kenchan0130/markdown-to-atlassian-wiki-markup
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

- list

**/
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
