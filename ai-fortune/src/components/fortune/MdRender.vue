<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

// 创建 scoped marked 实例，避免全局副作用
const md = new marked.Marked({ breaks: true, gfm: true })

const rendered = computed(() => {
  if (!props.content) return ''

  // 为所有链接添加安全属性（marked v18 签名：单个 token 对象）
  const renderer = new marked.Renderer()
  const originalLink = renderer.link.bind(renderer)
  renderer.link = function (token) {
    const html = originalLink(token)
    // 为外部链接添加 rel 安全属性
    if (typeof html === 'string' && !html.includes('rel="noopener')) {
      return html.replace('<a ', '<a rel="noopener noreferrer" ')
    }
    return html
  }

  const rawHtml = md.parse(props.content, { renderer })
  return DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: ['h2', 'h3', 'h4'],
    ADD_ATTR: ['target', 'rel']
  })
})
</script>

<template>
  <div class="markdown-body text-text leading-relaxed text-sm" v-html="rendered"></div>
</template>

<style scoped>
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  color: var(--color-gold);
  font-family: var(--font-display);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.markdown-body :deep(h2) {
  font-size: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(212, 165, 116, 0.3);
}

.markdown-body :deep(h3) {
  font-size: 1.125rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--color-border);
}

.markdown-body :deep(h4) {
  font-size: 1rem;
}

.markdown-body :deep(strong) {
  color: var(--color-gold-light);
  font-weight: 600;
}

.markdown-body :deep(em) {
  font-style: italic;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.markdown-body :deep(li) {
  margin-bottom: 0.25rem;
}

.markdown-body :deep(blockquote) {
  border-left: 2px solid rgba(212, 165, 116, 0.5);
  padding-left: 0.75rem;
  font-style: italic;
  color: var(--color-text-muted);
  margin: 0.5rem 0;
}

.markdown-body :deep(hr) {
  border-color: var(--color-border);
  margin: 1rem 0;
}

.markdown-body :deep(code) {
  background: var(--color-dark);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  color: var(--color-gold);
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
}

.markdown-body :deep(pre) {
  background: var(--color-dark);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(42, 42, 53, 0.3);
  overflow-x: auto;
  margin: 0.75rem 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-body :deep(a) {
  color: var(--color-gold);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.markdown-body :deep(a:hover) {
  color: var(--color-gold-light);
  border-bottom-color: var(--color-gold-light);
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5rem 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 0.375rem 0.75rem;
  border-bottom: 1px solid rgba(42, 42, 53, 0.3);
  text-align: left;
}

.markdown-body :deep(th) {
  color: var(--color-gold);
  font-weight: 600;
}
</style>
