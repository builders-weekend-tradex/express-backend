export const removingBrackets = (text) => {
    if (typeof text !== 'string') return '';
    const lastClosingTagIndex = text.lastIndexOf('>');
    return lastClosingTagIndex === -1 ? text : text.substring(lastClosingTagIndex + 1).trim();
  };