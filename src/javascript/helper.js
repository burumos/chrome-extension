import { copyFormats } from './constants.js';


export function createCopiedUrl(url, title, formatKey, isList=false) {
  switch (formatKey) {
    case copyFormats.scrapbox.key:
      return (isList ? ' ' : '') + `[${title} ${url}]`;
    case copyFormats.markdown.key:
    default:
      return (isList ? '- ': '') + `[${title}](${url})`;
  }
}
