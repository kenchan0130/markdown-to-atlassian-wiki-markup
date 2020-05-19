import "ts-polyfill/lib/es2019-array"; // It will be removed when node 10 is stopped supporting (become EOL).

import { immutable as uniq } from "array-unique";

import {
  AtlassianSupportLanguage,
  GitHubFlaveredMarkdownCodeBlockLanguageMapping,
  markdownToWikiMarkupLanguageMapping,
} from "./language";

describe("AtlassianSupportLanguage", (): void => {
  describe("enum values", (): void => {
    const enumValues = Object.values(AtlassianSupportLanguage);

    it("should be uniq", (): void => {
      expect(enumValues).toEqual(uniq(enumValues));
    });

    it("should not contain at least one capital letter", (): void => {
      expect(enumValues).toEqual(
        expect.arrayContaining([expect.not.stringMatching(/[A-Z]/)])
      );
    });
  });
});

describe("GitHubFlaveredMarkdownCodeBlockLanguageMapping", (): void => {
  describe("enum values", (): void => {
    const enumFlattenValues = Object.values(
      GitHubFlaveredMarkdownCodeBlockLanguageMapping
    ).flat();

    it("should be uniq", (): void => {
      expect(enumFlattenValues).toEqual(uniq(enumFlattenValues));
    });

    it("should not contain at least one capital letter", (): void => {
      expect(enumFlattenValues).toEqual(
        expect.arrayContaining([expect.not.stringMatching(/[A-Z]/)])
      );
    });
  });
});

describe("markdownToWikiMarkupLanguageMapping", (): void => {
  describe("supported github flaver markdown and atlassian wiki code blocklanguage", (): void => {
    it("should return atlassian wiki markup language", (): void => {
      const supportedLanguage = "osascript";
      expect(
        markdownToWikiMarkupLanguageMapping.get(supportedLanguage)
      ).toEqual(AtlassianSupportLanguage.AppleScript);
    });
  });

  describe("non supported github flaver markdown and atlassian wiki code block language", (): void => {
    it("should return undefined", (): void => {
      const nonSupportedLanguage = "tex";

      expect(
        markdownToWikiMarkupLanguageMapping.get(nonSupportedLanguage)
      ).toBeUndefined();
    });
  });
});
