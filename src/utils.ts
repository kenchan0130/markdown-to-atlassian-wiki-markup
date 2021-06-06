// See also: https://github.com/sindresorhus/escape-string-regexp
export const escapeStringRegexp = (s: string): string => {
  return s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
};

export const uniq = <T>(array: Array<T>): Array<T> => [...new Set(array)];
