export async function correctVideoUrl(url: string) {
  if (/https?:\/\/.+\.(mp4|webm|ogg|avi|mkv)/.test(url)) {
    return { type: 'video', url: url, error: false }
  }

  if (/https:\/\/(m\.|www\.)?youtube\.com\/watch\?v=.+/.test(url)) {
    const id = new URL(url).searchParams.get('v')

    return {
      type: 'iframe',
      url: `https://www.youtube.com/embed/${id}`,
      error: false,
    }
  }

  if (/https:\/\/youtu\.be\/.+/.test(url)) {
    const path = new URL(url).pathname

    return {
      type: 'iframe',
      url: `https://www.youtube.com/embed/${path.slice(1, path.length)}`,
      error: false,
    }
  }
  if (/https:\/\/www.youtube.com\/embed\/.+/.test(url)) {
    return { type: 'iframe', url: url, error: false }
  }
  if (/https:\/\/rutube.ru\/video\/.+/.test(url)) {
    const path = new URL(url).pathname

    return {
      type: 'iframe',
      url: `https://rutube.ru/play/embed/${path.slice(7, path.length)}`,
      error: false,
    }
  }
  if (/https:\/\/rutube.ru\/play\/embed\/.+/.test(url)) {
    return {
      type: 'iframe',
      url: url,
      error: false,
    }
  }

  if (!url.startsWith('http')) {
    return { error: true }
  }

  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (
      response.ok &&
      (response.headers.get('Content-Type')?.startsWith('video/') ||
        response.headers.get('Cache-Control'))
    ) {
      return { type: 'video', url: url, error: false }
    }
    return { error: true }
  } catch {
    return { error: true }
  }
}

export async function isCorrectImageUrl(url: string) {
  if (url.startsWith('data:image')) {
    return true
  }

  if (/https?:\/\/.+\.[(jpg)(jpeg)(png)(webp)(gif)(svg)]/.test(url)) {
    return true
  }

  if (!url.startsWith('http')) {
    return false
  }

  try {
    const response = await fetch(url, { method: 'HEAD' })
    return (
      response.ok &&
      (response.headers.get('Content-Type')?.startsWith('image/') ||
        response.headers.get('Cache-Control'))
    )
  } catch {
    return false
  }
}
