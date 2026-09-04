export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function textToHtml(text: string): string {
  if (!text) return '<p></p>'
  return text
    .split(/\r?\n/)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')
}

export function parseInline(text: string): string {
  let html = text

  // Convert standard markdown inline styles
  // Bold (** or __)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')

  // Italic (* or _)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')

  // Inline code (`)
  html = html.replace(/`(.*?)`/g, '<code>$1</code>')

  return html
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''
  const lines = markdown.split(/\r?\n/)
  const result: string[] = []
  let currentListType: 'ul' | 'ol' | 'task' | null = null

  const closeList = () => {
    if (currentListType === 'ul') {
      result.push('</ul>')
    } else if (currentListType === 'ol') {
      result.push('</ol>')
    } else if (currentListType === 'task') {
      result.push('</ul>')
    }
    currentListType = null
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Empty lines
    if (trimmed === '') {
      closeList()
      result.push('<p></p>')
      continue
    }

    // Check headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      closeList()
      const level = headingMatch[1].length
      result.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`)
      continue
    }

    // Check horizontal rule
    if (/^(---|___|\*\*\*)$/.test(trimmed)) {
      closeList()
      result.push('<hr />')
      continue
    }

    // Check blockquote
    const quoteMatch = line.match(/^>\s+(.*)$/)
    if (quoteMatch) {
      closeList()
      result.push(`<blockquote>${parseInline(quoteMatch[1])}</blockquote>`)
      continue
    }

    // Check task list item: - [ ] or - [x] or * [ ] or * [x]
    const taskMatch = line.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/)
    if (taskMatch) {
      if (currentListType !== 'task') {
        closeList()
        result.push('<ul data-type="taskList">')
        currentListType = 'task'
      }
      const checked = taskMatch[1].toLowerCase() === 'x'
      result.push(
        `<li data-type="taskItem" data-checked="${checked}">${parseInline(taskMatch[2])}</li>`
      )
      continue
    }

    // Check bullet list item: - item or * item
    const bulletMatch = line.match(/^[-*]\s+(.*)$/)
    if (bulletMatch) {
      if (currentListType !== 'ul') {
        closeList()
        result.push('<ul>')
        currentListType = 'ul'
      }
      result.push(`<li>${parseInline(bulletMatch[1])}</li>`)
      continue
    }

    // Check ordered list item: 1. item
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/)
    if (orderedMatch) {
      if (currentListType !== 'ol') {
        closeList()
        result.push('<ol>')
        currentListType = 'ol'
      }
      result.push(`<li>${parseInline(orderedMatch[2])}</li>`)
      continue
    }

    // If it's a normal paragraph line, check if we are in a list. If so, close it.
    if (currentListType) {
      closeList()
    }
    result.push(`<p>${parseInline(line)}</p>`)
  }

  closeList()
  return result.join('\n')
}

export function htmlToMarkdown(html: string): string {
  if (!html) return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const rawMarkdown = childrenToMarkdown(doc.body)

  // Clean up excessive consecutive newlines (more than 2)
  return rawMarkdown.replace(/\n{3,}/g, '\n\n').trim()
}

// Converts a single DOM node (text or element) to its markdown representation.
function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || ''
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const el = node as HTMLElement
  const tagName = el.tagName.toLowerCase()

  switch (tagName) {
    case 'h1':
      return `# ${childrenToMarkdown(el)}\n\n`
    case 'h2':
      return `## ${childrenToMarkdown(el)}\n\n`
    case 'h3':
      return `### ${childrenToMarkdown(el)}\n\n`
    case 'h4':
      return `#### ${childrenToMarkdown(el)}\n\n`
    case 'h5':
      return `##### ${childrenToMarkdown(el)}\n\n`
    case 'h6':
      return `###### ${childrenToMarkdown(el)}\n\n`
    case 'p': {
      const parentName = el.parentElement?.tagName.toLowerCase()
      if (parentName === 'li') {
        return childrenToMarkdown(el)
      }
      return `${childrenToMarkdown(el)}\n\n`
    }
    case 'strong':
    case 'b':
      return `**${childrenToMarkdown(el)}**`
    case 'em':
    case 'i':
      return `*${childrenToMarkdown(el)}*`
    case 'u':
      return `<u>${childrenToMarkdown(el)}</u>`
    case 'code':
      return `\`${el.textContent}\``
    case 'br':
      return '\n'
    case 'ul': {
      let markdown = childrenToMarkdown(el)
      if (el.parentElement?.tagName.toLowerCase() !== 'li') {
        markdown += '\n'
      }
      return markdown
    }
    case 'ol': {
      let counter = 1
      for (let c = 0; c < el.childNodes.length; c++) {
        const li = el.childNodes[c]
        if (li.nodeName.toLowerCase() === 'li') {
          ;(li as ChildNode & { _olIndex?: number })._olIndex = counter++
        }
      }
      let markdown = childrenToMarkdown(el)
      if (el.parentElement?.tagName.toLowerCase() !== 'li') {
        markdown += '\n'
      }
      return markdown
    }
    case 'li': {
      const isTaskItem =
        el.getAttribute('data-type') === 'taskItem' || el.hasAttribute('data-checked')
      if (isTaskItem) {
        const checked = el.getAttribute('data-checked') === 'true'
        return `- [${checked ? 'x' : ' '}] ${childrenToMarkdown(el)}\n`
      }
      const olIndex = (el as HTMLElement & { _olIndex?: number })._olIndex
      if (olIndex !== undefined) {
        return `${olIndex}. ${childrenToMarkdown(el)}\n`
      }
      return `- ${childrenToMarkdown(el)}\n`
    }
    case 'span': {
      const style = el.getAttribute('style')
      if (style) {
        return `<span style="${style}">${childrenToMarkdown(el)}</span>`
      }
      return childrenToMarkdown(el)
    }
    case 'blockquote':
      return `> ${childrenToMarkdown(el)}\n\n`
    case 'hr':
      return '---\n\n'
    default:
      if (el.getAttribute('style') || el.getAttribute('class')) {
        const serializedChildren = childrenToMarkdown(el)
        const tagMatch = el.outerHTML.match(/^<[a-zA-Z0-9]+[^>]*>/)
        if (tagMatch) {
          return `${tagMatch[0]}${serializedChildren}</${tagName}>`
        }
        return childrenToMarkdown(el)
      }
      return childrenToMarkdown(el)
  }
}

function childrenToMarkdown(element: HTMLElement): string {
  let markdown = ''
  for (let i = 0; i < element.childNodes.length; i++) {
    markdown += nodeToMarkdown(element.childNodes[i])
  }
  return markdown
}
