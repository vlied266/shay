import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SEEK_THRESHOLD = 0.016
const DAMPING_FACTOR = 0.15

interface ScrollVideoProps {
  src: string
  onDurationChange?: (duration: number) => void
  onProgress?: (progress: number) => void
}

export default function ScrollVideo({ src, onDurationChange, onProgress }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const playheadRef = useRef(0)
  const targetTimeRef = useRef(0)
  const isSeeking = useRef(false)
  const rafRef = useRef<number | null>(null)
  const prefersReducedMotion = window.matchMedia('(prefers-reduce-motion: reduce)').matches

  useGSAP(() => {
    const video = videoRef.current
    if (!video) return

    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        targetTimeRef.current = video.duration * self.progress

        if (!isSeeking.current && Math.abs(targetTimeRef.current - playheadRef.current) > SEEK_THRESHOLD) {
          video.currentTime = targetTimeRef.current
          isSeeking.current = true
        }

        onProgress?.(self.progress)
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, { scope: videoRef })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setIsLoading(false)
      onDurationChange?.(video.duration)
    }

    const handlePlay = (e: Event) => {
      e.preventDefault()
      ;(e.target as HTMLVideoElement).pause()
    }

    const handleSeeked = () => {
      isSeeking.current = false
      playheadRef.current = video.currentTime
    }

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('seeked', handleSeeked)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('seeked', handleSeeked)
      video.removeEventListener('error', handleError)
    }
  }, [onDurationChange, onProgress])

  useEffect(() => {
    if (!videoRef.current || prefersReducedMotion) return

    const ease = () => {
      const video = videoRef.current
      if (!video || isSeeking.current) return

      const delta = targetTimeRef.current - playheadRef.current
      playheadRef.current += delta * DAMPING_FACTOR

      if (Math.abs(delta) > SEEK_THRESHOLD) {
        rafRef.current = requestAnimationFrame(ease)
      }
    }

    rafRef.current = requestAnimationFrame(ease)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [prefersReducedMotion])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="w-12 h-12 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <p className="text-white text-sm">Unable to load video</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      />
    </div>
  )
}
