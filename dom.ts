// dom.ts
// TypeScript port of dom.js

export const isNotWhitespace = (value: Node): boolean =>
  value.nodeType !== Node.TEXT_NODE || !!value.nodeValue?.trim().length;
