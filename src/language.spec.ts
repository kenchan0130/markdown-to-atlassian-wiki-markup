import { immutable as uniq } from "array-unique";

import {
  AtlassianSupportLanguage,
  markdownToWikiMarkupLanguageMapping
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

describe("markdownToWikiMarkupLanguageMapping", (): void => {
  describe("object keys", (): void => {
    const objectKeys = Object.keys(markdownToWikiMarkupLanguageMapping);

    it("should not contain at least one capital letter", (): void => {
      expect(objectKeys).toEqual(
        expect.arrayContaining([expect.not.stringMatching(/[A-Z]/)])
      );
    });
  });
});
