import Config, { ApiProxy } from '@/config'
import { nFileQuery } from '@/api'
import { ResponseMode } from '@/typings/params'
import { PrefetchItem } from '@/hooks/state/use-prefetch'

function parseHtmlUrl (html: string, origin: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const sUrls = Array.from(doc.querySelectorAll('script[src]'))
    .map((script: any) => script.src)


  const lUrls = Array.from(doc.querySelectorAll('link[href]'))
    .map((link: any) => link.href)

  const urls = [...sUrls, ...lUrls]
  const uUrls: string[] = urls.map((url: string) => {
    if (!url.startsWith('http') || !url) return url
    return `${origin.replace('index.html', '')}static/${url.split('static/')[1]}`
  })
  return uUrls.filter((url: string) => !!url)
}

export function prefetchResource (data: PrefetchItem[]) {
  const worker = new Worker('@static/js/worker.prefetch.js')

  data.map((o: PrefetchItem) => {
    const { key } = o
    switch (true) {
      case key === 'iframe':
        fetchParseHtml(String(o.url), o.origin)
        break
      case key === 'meta-files':
        fetchMetaFiles()
        break
      default: break
    }
  })

  async function fetchMetaFiles () {
    try {
      const { folders } = Config.project.meta || {}
      if (!folders?.length) return
      const { data }: ResponseMode = await nFileQuery({
        fields: 'url',
        s: { businessId: { $in: folders }, projectId: Config.project.id },
        delete: 0
      })
      const urls = data.map((o: any) => `${ApiProxy.node.main}/${o.url}`)
      if (urls?.length > 0) {
        worker.postMessage({ source: 'source', urls })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchParseHtml (htmlUrl: string, origin = '') {
    const urls: any = await fetch(htmlUrl).then(response => response.text())
      .then((html: string) => parseHtmlUrl(html, origin))
      .catch(error => console.error('获取 HTML 失败:', error))

    if (urls?.length > 0) {
      worker.postMessage({ source: 'source', urls })
    }
  }
  return worker
}
