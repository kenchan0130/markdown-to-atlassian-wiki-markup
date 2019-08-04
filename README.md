# @kenchan0130/markdown-to-atlassian-wiki-markup

<!-- TODO: fix references -->
[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][david-image]][david-url]

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
