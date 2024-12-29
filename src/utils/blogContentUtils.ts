export interface BlogContentNode {
  type: string;
  content?: BlogContentNode[];
  text?: string;
  attrs?: Record<string, any>;
}

export const convertHtmlToJson = (html: string): BlogContentNode[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const convertNode = (node: Node): BlogContentNode | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text ? { type: 'text', text } : null;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const type = element.tagName.toLowerCase();
      const content: BlogContentNode[] = [];
      
      element.childNodes.forEach(child => {
        const converted = convertNode(child);
        if (converted) content.push(converted);
      });

      return {
        type,
        content: content.length > 0 ? content : undefined,
      };
    }

    return null;
  };

  const body = doc.body;
  const result: BlogContentNode[] = [];
  
  body.childNodes.forEach(node => {
    const converted = convertNode(node);
    if (converted) result.push(converted);
  });

  return result;
};

export const convertJsonToHtml = (nodes: BlogContentNode[]): string => {
  const convertNode = (node: BlogContentNode): string => {
    if (node.type === 'text') {
      return node.text || '';
    }

    const content = node.content
      ? node.content.map(child => convertNode(child)).join('')
      : '';

    return `<${node.type}>${content}</${node.type}>`;
  };

  return nodes.map(node => convertNode(node)).join('\n');
};