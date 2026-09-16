import { useState } from 'react'
import { toBlob } from 'html-to-image'

interface ShareButtonProps {
  text: string
}

export function ShareButton({ text }: ShareButtonProps) {
  const [label, setLabel] = useState('SHARE YOUR CLASS')

  async function share() {
    const node = document.querySelector('.app.playing')
    if (!(node instanceof HTMLElement)) return

    setLabel('SHARING...')
    node.classList.add('capturing')
    try {
      const blob = await toBlob(node, {
        cacheBust: true,
        pixelRatio: Math.min(2, window.devicePixelRatio || 1),
        width: node.clientWidth,
        height: node.clientHeight,
      })
      if (!blob) throw new Error('empty screenshot')
      const file = new File([blob], 'my-2019-class.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ title: 'My 2019 Class', text, files: [file] })
          setLabel('SHARE YOUR CLASS')
          return
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            setLabel('SHARE YOUR CLASS')
            return
          }
        }
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'my-2019-class.png'
      link.click()
      URL.revokeObjectURL(url)
      setLabel('SAVED ✓')
      window.setTimeout(() => setLabel('SHARE YOUR CLASS'), 1800)
    } catch {
      try {
        await navigator.clipboard.writeText(text)
        setLabel('COPIED ✓')
      } catch {
        setLabel('SHARE YOUR CLASS')
      }
      window.setTimeout(() => setLabel('SHARE YOUR CLASS'), 1800)
    } finally {
      node.classList.remove('capturing')
    }
  }

  return (
    <button type="button" className="share-btn" onClick={share} disabled={label === 'SHARING...'}>
      {label}
    </button>
  )
}
