import {
  CodeBlockTheme,
  markdownToAtlassianWikiMarkup,
  MarkdownToAtlassianWikiMarkupOptions
} from "./index";
import { AtlassianSupportLanguage } from "./language";

describe("markdownToAtlassianWikiMarkup", (): void => {
  const paragraphNewLinesAtTail = "\n\n";

  describe("Paragraph", (): void => {
    it("should render with two new lines", (): void => {
      const markdown = `This is first paragraph.

This is second paragraph.`;
      const expected = `This is first paragraph.

This is second paragraph.${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });

    describe("HTML special characters", (): void => {
      it("should not be escaped", (): void => {
        const markdown = "\" & : < > '";
        const expected = `" & : < > '${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("Heading", (): void => {
    describe("with sharpe number signs", (): void => {
      it("should render with 'h'", (): void => {
        const markdown = `# This is h1

## This is h2

### This is h3

#### This is h4

##### This is h5

###### This is h6`;
        const expected = `h1. This is h1

h2. This is h2

h3. This is h3

h4. This is h4

h5. This is h5

h6. This is h6

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with alternate syntax", (): void => {
      it("should render with 'h'", (): void => {
        const markdown = `This is h1
===============

This is h2
---------------`;
        const expected = `h1. This is h1

h2. This is h2

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("Strong", (): void => {
    it("should render sandwiched by '*'", (): void => {
      const markdown = "**bold by asterisks** __bold by underscores__";
      const expected = `*bold by asterisks* *bold by underscores*${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Emphasis", (): void => {
    it("should render sandwiched by '_'", (): void => {
      const markdown = "*italic by asterisks* _italic by underscores_";
      const expected = `_italic by asterisks_ _italic by underscores_${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Del", (): void => {
    it("should render sandwiched by '-'", (): void => {
      const markdown = "~~deleted by tildes~~";
      const expected = `-deleted by tildes-${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Code Span", (): void => {
    it("should render sandwiched by '{{' and '}}'", (): void => {
      const markdown = "`code span by backticks`";
      const expected = `{{code span by backticks}}${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Blockquote", (): void => {
    it("should render sandwiched by '{quote}'", (): void => {
      const markdown = `> This is quote first line.
This is quote second line.
`;
      const expected = `{quote}This is quote first line.
This is quote second line.{quote}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Hard Line Breaks", (): void => {
    it("should render with new line", (): void => {
      const markdown = `This is new line first.\\
This is new line second.`;
      const expected = `This is new line first.
This is new line second.${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Horizontal Rule", (): void => {
    it("should render four minuses", (): void => {
      const markdown = `---
***
___`;
      const expected = `----
----
----
`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Link", (): void => {
    describe("with text", (): void => {
      it("should render sandwiched by '[' and ']' with text", (): void => {
        const markdown = "[This is text](http://example.com)";
        const expected = `[This is text|http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("without text and title", (): void => {
      it("should render sandwiched by '[' and ']'", (): void => {
        const markdown = "[](http://example.com)";
        const expected = `[http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with title", (): void => {
      it("should render sandwiched by '[' and ']' with text", (): void => {
        const markdown = "[](http://example.com 'This is title')";
        const expected = `[This is title|http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("without text", (): void => {
      it("should render sandwiched by '[' and ']'", (): void => {
        const markdown = "[](http://example.com)";
        const expected = `[http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with text and title", (): void => {
      it("should render sandwiched by '[' and ']' and prioritize text", (): void => {
        const markdown = "[This is text](http://example.com 'This is title')";
        const expected = `[This is text|http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("List and List Item", (): void => {
    describe("bullet list", (): void => {
      it("should render list with asterisks", (): void => {
        const markdown = `- This is list 1
- This is list 2
    - This is list 2-1
    - This is list 2-2
        - This is list 2-2-1
- This is list 3`;
        const expected = `
* This is list 1
* This is list 2
** This is list 2-1
** This is list 2-2
*** This is list 2-2-1
* This is list 3
`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("numbered list", (): void => {
      it("should render list with sharps", (): void => {
        const markdown = `1. This is list 1
2. This is list 2
    1. This is list 2-1
    2. This is list 2-2
        1. This is list 2-2-1
3. This is list 3`;
        const expected = `
# This is list 1
# This is list 2
## This is list 2-1
## This is list 2-2
### This is list 2-2-1
# This is list 3
`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("bullet and numbered list", (): void => {
      it("should render list with sterisks and sharps", (): void => {
        const markdown = `1. This is list 1
2. This is list 2
    - This is list 2-1
    - This is list 2-2`;
        const expected = `
# This is list 1
# This is list 2
#* This is list 2-1
#* This is list 2-2
`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("Checkbox", (): void => {
    it("should render blank", (): void => {
      const markdown = `- [ ] This is checkbox without checked
- [x] This is checkbox with checked`;
      const expected = `
* This is checkbox without checked
* This is checkbox with checked
`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Image", (): void => {
    describe("without description", (): void => {
      it("should render sandwiched by '!'", (): void => {
        const markdown = "![](http://exmaple.com/example.png)";
        const expected = `!http://exmaple.com/example.png!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with description", (): void => {
      it("should render sandwiched by '!' with description as alt", (): void => {
        const markdown =
          "![This is description](http://exmaple.com/example.png)";
        const expected = `!http://exmaple.com/example.png|alt=This is description!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("without title", (): void => {
      it("should render sandwiched by '!'", (): void => {
        const markdown = "![](http://exmaple.com/example.png)";
        const expected = `!http://exmaple.com/example.png!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with title", (): void => {
      it("should render sandwiched by '!' with title", (): void => {
        const markdown = "![](http://exmaple.com/example.png 'This is title')";
        const expected = `!http://exmaple.com/example.png|title=This is title!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with multiple params", (): void => {
      it("should render sandwiched by '!' and joined by ','", (): void => {
        const markdown =
          "![This is description](http://exmaple.com/example.png 'This is title')";
        const expected = `!http://exmaple.com/example.png|alt=This is description,title=This is title!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("Table", (): void => {
    it("should render header sandwiched by '||' and row sandwiched by '|'", (): void => {
      const markdown = `header1|header2
---|---
row1, col1|row1, col2
row2, col1|row2, col2
`;
      const expected = `
||header1||header2||
|row1, col1|row1, col2|
|row2, col1|row2, col2|

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Code", (): void => {
    it("should render sandwiched by '{code}' with parameters", (): void => {
      const markdown = `
\`\`\`javascript
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
\`\`\`
`;
      const expected = `{code:collapse=false|language=javascript|linenumbers=false|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });

    describe("when not found language", (): void => {
      it("should render sandwiched by '{code}' with none parameter", (): void => {
        const markdown = `
\`\`\`pony
actor Main
  new create(env: Env) =>
    env.out.print("Hello, world!")
\`\`\`
`;
        const expected = `{code:collapse=false|language=none|linenumbers=false|theme=Confluence}
actor Main
  new create(env: Env) =>
    env.out.print("Hello, world!")
{code}

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });
});

describe("markdownToAtlassianWikiMarkup Options", (): void => {
  describe("codeBlockTheme", (): void => {
    it("should use specified code block theme", (): void => {
      const theme = CodeBlockTheme.Midnight;
      const options = new MarkdownToAtlassianWikiMarkupOptions({
        codeBlock: {
          theme: theme
        }
      });

      const markdown = `
\`\`\`javascript
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
\`\`\`
`;
      const expected = `{code:collapse=false|language=javascript|linenumbers=false|theme=${theme}}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });
  });

  describe("showCodeBlockLineNumber", (): void => {
    const markdown = `
\`\`\`javascript
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
\`\`\`
`;

    it("should use specified code block used linenumber or not", (): void => {
      const options = new MarkdownToAtlassianWikiMarkupOptions({
        codeBlock: {
          showLineNumbers: true
        }
      });

      const expected = `{code:collapse=false|language=javascript|linenumbers=true|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });

    it("should use specified code block used linenumber or not with function", (): void => {
      const options = new MarkdownToAtlassianWikiMarkupOptions({
        codeBlock: {
          showLineNumbers: (
            _code: string,
            _lang: AtlassianSupportLanguage
          ): boolean => {
            return true;
          }
        }
      });

      const expected = `{code:collapse=false|language=javascript|linenumbers=true|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });
  });

  describe("collapse", (): void => {
    const markdown = `
\`\`\`javascript
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
\`\`\`
`;

    it("should use specified code block used collapse or not", (): void => {
      const options = new MarkdownToAtlassianWikiMarkupOptions({
        codeBlock: {
          collapse: true
        }
      });

      const expected = `{code:collapse=true|language=javascript|linenumbers=false|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });

    it("should use specified code block used collapse or not with function", (): void => {
      const options = new MarkdownToAtlassianWikiMarkupOptions({
        codeBlock: {
          collapse: (
            _code: string,
            _lang: AtlassianSupportLanguage
          ): boolean => {
            return true;
          }
        }
      });

      const expected = `{code:collapse=true|language=javascript|linenumbers=false|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });
  });
});
