'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import styles from './GardenExperience.module.css'

const scenes = [
  { name: 'The terrace', image: 'IMG-20251127-WA0049.jpg', alt: 'A quiet seat among pots of pink, white and yellow flowers on the terrace', heading: 'A little garden.', italic: 'A whole world.', note: 'Some things grow into more than you imagined.', position: 'center 60%', label: 'A moment on the terrace', x: '72%', y: '49%' },
  { name: 'Among the flowers', image: 'IMG-20251209-WA0015.jpg', alt: 'Pink and purple flowers spilling over terracotta pots along the garden steps', heading: 'Come a little', italic: 'closer.', note: 'There is a whole story in the smallest things.', position: 'center 55%', label: 'Look a little closer', x: '70%', y: '43%' },
  { name: 'The hands behind it', image: 'IMG-20251109-WA0019.jpg', alt: 'The gardener holding a flowering plant on the sunlit terrace', heading: 'Grown with care.', italic: 'Kept with love.', note: 'A garden is also a portrait of the person who tends it.', position: 'center 57%', label: 'The people, the place', x: '72%', y: '50%' },
]
const album = [
  { image: 'IMG-20251127-WA0049.jpg', caption: 'A place to pause', note: 'The terrace, in the company of flowers.' },
  { image: 'IMG-20251209-WA0015.jpg', caption: 'Every shade of pink', note: 'A closer look at the pots along the steps.' },
  { image: 'IMG-20251109-WA0019.jpg', caption: 'The hands behind the garden', note: 'Care you can see in every bloom.' },
  { image: 'IMG-20250617-WA0015.jpg', caption: 'Something worth holding', note: 'A moment with the hydrangeas.' },
  { image: 'IMG-20251127-WA0053.jpg', caption: 'Stay a little longer', note: 'Another afternoon, another reason to be here.' },
]

export default function GardenExperience() {
  const [scene, setScene] = useState(0)
  const [photo, setPhoto] = useState(0)
  const [panel, setPanel] = useState<'album' | 'story' | 'film'>('album')
  const [quiet, setQuiet] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const { count, setIsOpen } = useCart()
  const current = scenes[scene]

  function openPanel(next: typeof panel) {
    setPanel(next)
    setPhoto(scene)
    dialog.current?.showModal()
  }

  return (
    <main className={styles.world}>
      <div className={styles.scenery}>
        {scenes.map((item, i) => <Image key={item.image} src={`/images/${item.image}`} alt={i === scene ? item.alt : ''} fill priority={i === 0} sizes="100vw" className={`${styles.scene} ${i === scene ? styles.visible : ''}`} style={{ objectPosition: item.position }} />)}
      </div>
      <div className={`${styles.shade} ${quiet ? styles.lightShade : ''}`} />

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Jupeang home">jupeang<span>KONYAK FOR FLOWER</span></Link>
        <nav aria-label="Main navigation" className={styles.nav}>
          <button className={styles.currentNav} onClick={() => { setQuiet(false); setScene(0) }}>The garden</button>
          <button onClick={() => openPanel('story')}>Our story</button>
          <button onClick={() => openPanel('album')}>The album</button>
          <Link href="/collections">The shop <span aria-hidden="true">↗</span></Link>
        </nav>
        <button className={styles.bag} onClick={() => setIsOpen(true)} aria-label={`Open bag, ${count} items`}>Bag <span>{String(count).padStart(2, '0')}</span></button>
      </header>

      {!quiet && <>
        <div className={styles.sideNote}>A GARDEN. A STORY. A WAY OF LIFE.</div>
        <section className={styles.intro} aria-live="polite">
          <div className={styles.eyebrow}><span /> WELCOME TO OUR CORNER OF THE WORLD</div>
          <h1>{current.heading}<br /><em>{current.italic}</em></h1>
          <p>{current.note}<br />Welcome to Jupeang. Make yourself at home.</p>
          <button className={styles.explore} onClick={() => setScene((scene + 1) % scenes.length)}>Wander through the garden <span aria-hidden="true">↗</span></button>
        </section>
        <button className={styles.hotspot} aria-label={current.label} style={{ left: current.x, top: current.y }} onClick={() => openPanel(scene === 2 ? 'story' : 'album')}>
          <span className={styles.hotspotIcon} aria-hidden="true">+</span><span className={styles.hotspotText}>{current.label}<small>OPEN A LITTLE STORY</small></span>
        </button>
        <div className={styles.marginNote}><span>Field notes / 001</span><p>Life is a little lovelier<br />when you let it grow.</p></div>
      </>}

      <footer className={styles.bottom}>
        <div className={styles.location}><span className={styles.smallLabel}>YOU ARE HERE</span><span>In the garden <span className={styles.locationDot}>·</span> Jupeang</span></div>
        <nav className={styles.sceneNav} aria-label="Garden viewpoints">
          {scenes.map((item, i) => <button key={item.name} aria-label={item.name} aria-pressed={scene === i} onClick={() => setScene(i)} className={scene === i ? styles.selectedScene : ''}>
            <span className={styles.thumb}><Image src={`/images/${item.image}`} alt="" fill sizes="64px" /></span>
            <span><small>0{i + 1}</small>{item.name}</span>
          </button>)}
        </nav>
        <div className={styles.viewActions}>
          <button onClick={() => openPanel('film')}><span aria-hidden="true">▷</span> A garden moment</button>
          <button onClick={() => setQuiet(!quiet)} aria-pressed={quiet}><span aria-hidden="true">⤢</span> {quiet ? 'Show the words' : 'Just the view'}</button>
        </div>
      </footer>

      <dialog ref={dialog} className={styles.dialog} onClose={() => video.current?.pause()} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close() }} onKeyDown={e => {
        if (panel !== 'album') return
        if (e.key === 'ArrowRight') setPhoto(p => (p + 1) % album.length)
        if (e.key === 'ArrowLeft') setPhoto(p => (p + album.length - 1) % album.length)
      }} aria-label={panel === 'album' ? 'The garden album' : panel === 'film' ? 'A garden film' : 'The Jupeang story'}>
        <button className={styles.close} onClick={() => dialog.current?.close()} aria-label="Close dialog">×</button>
        {panel === 'album' && <div className={styles.album}>
          <div className={styles.albumImage}><Image src={`/images/${album[photo].image}`} alt={album[photo].caption} fill sizes="(max-width: 700px) 90vw, 65vw" style={{ objectFit: 'contain' }} /></div>
          <div className={styles.albumCaption} aria-live="polite"><div><span className={styles.smallLabel}>THE JUPEANG ALBUM · {String(photo + 1).padStart(2, '0')} / 05</span><h2>{album[photo].caption}</h2><p>{album[photo].note}</p></div><div className={styles.albumArrows}><button aria-label="Previous photograph" onClick={() => setPhoto((photo + album.length - 1) % album.length)}>←</button><button aria-label="Next photograph" onClick={() => setPhoto((photo + 1) % album.length)}>→</button></div></div>
        </div>}
        {panel === 'story' && <div className={styles.story}>
          <div className={styles.storyImage}><Image src="/images/IMG-20250617-WA0015.jpg" alt="Holding hydrangeas in the terrace garden" fill sizes="(max-width: 700px) 90vw, 40vw" style={{ objectFit: 'cover' }} /></div>
          <div className={styles.storyText}><span className={styles.smallLabel}>THE STORY IS STILL GROWING</span><h2>A place for<br /><em>things we love.</em></h2><p>Jupeang means flower in Konyak. Here, it is also a place to keep the moments around it.</p><p>The pots on the terrace. The hands that tend them. A photograph taken because something, that day, was too lovely to pass by.</p><p>A garden, a collection of memories, and a little shop. All part of the same growing story.</p><Link href="/garden">Read the garden journal <span aria-hidden="true">↗</span></Link><Link href="/collections">Visit the shop <span aria-hidden="true">↗</span></Link></div>
        </div>}
        {panel === 'film' && <div className={styles.film}><span className={styles.smallLabel}>FROM THE GARDEN · A MOVING MEMORY</span><video ref={video} controls playsInline preload="metadata" src="/images/VID-20251217-WA0007.mp4" /><p>A little time in the garden.</p></div>}
      </dialog>
    </main>
  )
}
