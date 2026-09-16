import { useState } from 'react'
import { toBlob } from 'html-to-image'

interface ShareButtonProps {
  text: string
}

function shot(node: HTMLElement) {
  return toBlob(node, {
    cacheBust: true,
    pixelRatio: Math.min(2, window.devicePixelRatio || 1),
    width: node.clientWidth,
    height: node.clientHeight,
  }).then((blob) => {
    if (!blob) throw new Error('empty screenshot')
    return blob
  })
}

export function ShareButton({ text }: ShareButtonProps) {
  const [label, setLabel] = useState('SHARE YOUR CLASS')

  async function share() {
    const node = document.querySelector('.app.playing')
    if (!(node instanceof HTMLElement)) return

    setLabel('COPYING...')
    node.classList.add('capturing')
    const blobPromise = shot(node)
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blobPromise })])
      setLabel('COPIED ✓')
    } catch {
      try {
        const blob = await blobPromise
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setLabel('COPIED ✓')
      } catch {
        try {
          await navigator.clipboard.writeText(text)
          setLabel('COPIED TEXT ✓')
        } catch {
          setLabel('SHARE YOUR CLASS')
        }
      }
    } finally {
      node.classList.remove('capturing')
      window.setTimeout(() => setLabel('SHARE YOUR CLASS'), 1800)
    }
  }

  return (
    <button type="button" className="share-btn" onClick={share} disabled={label === 'COPYING...'}>
      {label}
    </button>
  )
}
