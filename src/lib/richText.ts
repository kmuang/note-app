const allowedTags = new Set(['A', 'B', 'BLOCKQUOTE', 'BR', 'DIV', 'EM', 'FONT', 'H1', 'H2', 'H3', 'HR', 'I', 'LI', 'OL', 'P', 'S', 'SPAN', 'STRONG', 'TABLE', 'TBODY', 'TD', 'TH', 'THEAD', 'TR', 'U', 'UL']);

export const toSafeEditorHtml = (value: string) => {
    const looksLikeRichText = /<\/?(a|b|blockquote|br|div|em|font|h[1-3]|hr|i|li|ol|p|s|span|strong|table|tbody|td|th|thead|tr|u|ul)\b/i.test(value);
    const source = looksLikeRichText ? value : value.split('\n').map(line => line ? line.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') : '<br>').join('<br>');
    const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html');
    const clean = (node: Node): string => {
        if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        if (!(node instanceof HTMLElement)) return '';
        const children = Array.from(node.childNodes).map(clean).join('');
        if (!allowedTags.has(node.tagName)) return children;
        if (node.tagName === 'BR' || node.tagName === 'HR') return `<${node.tagName.toLowerCase()}>`;
        const attrs: string[] = [];
        if (node.tagName === 'A') {
            const href = node.getAttribute('href') ?? '';
            if (/^(https?:|mailto:|tel:)/i.test(href)) attrs.push(`href="${href.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}" target="_blank" rel="noopener noreferrer"`);
        }
        if (node.tagName === 'FONT') {
            const color = node.getAttribute('color') ?? '';
            if (/^#[\da-f]{3,8}$/i.test(color)) attrs.push(`color="${color}"`);
        }
        const color = node.style.color;
        if (color && /^(#[\da-f]{3,8}|rgb\([\d\s,%.]+\)|[a-z]{3,20})$/i.test(color)) attrs.push(`style="color:${color}"`);
        const align = node.style.textAlign;
        if (['left', 'center', 'right', 'justify'].includes(align)) attrs.push(`style="${attrs.some(attr => attr.startsWith('style=')) ? `color:${color};` : ''}text-align:${align}"`);
        if (node.tagName === 'TD' || node.tagName === 'TH') {
            const colspan = Number(node.getAttribute('colspan'));
            if (colspan >= 1 && colspan <= 8) attrs.push(`colspan="${colspan}"`);
        }
        return `<${node.tagName.toLowerCase()}${attrs.length ? ` ${attrs.join(' ')}` : ''}>${children}</${node.tagName.toLowerCase()}>`;
    };
    return Array.from(parsed.body.firstElementChild?.childNodes ?? []).map(clean).join('')
        .replace(/(?:<(?:div|p)>(?:<br>)?<\/(?:div|p)>)+$/gi, '')
        .replace(/(?:<br>\s*){3,}/gi, '<br><br>');
};
