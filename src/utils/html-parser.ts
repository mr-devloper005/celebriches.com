/**
 * HTML parser utilities for processing raw HTML from JSON
 * Extracts text content and converts hyperlinks to bold formatting
 */

/**
 * Parse raw HTML and convert hyperlinks to bold text
 * @param rawHtml - Raw HTML string from JSON data
 * @returns Processed text with bold formatting for links
 */
export function parseHtmlToBoldText(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== 'string') {
    return '';
  }

  // Create a temporary DOM element to parse HTML
  const tempDiv = typeof document !== 'undefined' 
    ? document.createElement('div') 
    : null;

  if (tempDiv) {
    // Browser environment - use DOM parsing
    tempDiv.innerHTML = rawHtml;
    return processNodeToBoldText(tempDiv);
  } else {
    // Server-side environment - use regex parsing
    return parseHtmlWithRegex(rawHtml);
  }
}

/**
 * Process DOM nodes recursively and convert links to bold
 */
function processNodeToBoldText(node: any): string {
  let result = '';

  if (node.nodeType === 3) {
    // Text node
    result += node.textContent || '';
  } else if (node.nodeType === 1) {
    // Element node
    const tagName = node.tagName?.toLowerCase();
    
    if (tagName === 'a') {
      // Convert hyperlink to bold text
      const linkText = node.textContent || '';
      result += `**${linkText}**`;
    } else if (tagName === 'br') {
      result += '\n';
    } else if (tagName === 'p' || tagName === 'div') {
      // Block elements - add spacing
      for (const child of node.childNodes) {
        result += processNodeToBoldText(child);
      }
      result += '\n\n';
    } else {
      // Other elements - process children
      for (const child of node.childNodes) {
        result += processNodeToBoldText(child);
      }
    }
  }

  return result;
}

/**
 * Parse HTML using regex for server-side environments
 */
function parseHtmlWithRegex(html: string): string {
  let result = html;

  // Convert hyperlinks to bold text
  result = result.replace(/<a[^>]*>(.*?)<\/a>/gi, '**$1**');
  
  // Remove HTML tags but preserve line breaks
  result = result.replace(/<br\s*\/?>/gi, '\n');
  result = result.replace(/<\/p>/gi, '\n\n');
  result = result.replace(/<\/div>/gi, '\n\n');
  
  // Remove remaining HTML tags
  result = result.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.trim();
  
  return result;
}

/**
 * Extract clean text from HTML (without bold formatting)
 */
export function extractTextFromHtml(html: string): string {
  const boldText = parseHtmlToBoldText(html);
  // Remove bold formatting
  return boldText.replace(/\*\*(.*?)\*\*/g, '$1');
}

/**
 * Convert markdown-style bold text to HTML
 */
export function boldTextToHtml(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
