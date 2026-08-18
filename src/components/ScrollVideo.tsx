import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollVideoProps {
  src: string
  onDurationChange?: (duration: number) => void
  onProgress?: (progress: number) => void
}

export default function ScrollVideo({ src, onDurationChange, onProgress }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setIsLoading(false)
      onDurationChange?.(video.duration)
      console.log('Video loaded:', video.duration)
    }

    const handlePlay = (e: Event) => {
      e.preventDefault()
      ;(e.target as HTMLVideoElement).pause()
    }

    const handleError = (e: Event) => {
      console.error('Video error:', e)
      setHasError(true)
      setIsLoading(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('error', handleError)
    }
  }, [onDurationChange, onProgress])

  useGSAP(() => {
    const video = videoRef.current
    if (!video) return

    // Use viewport as trigger instead of 'body'
    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        if (video.duration) {
          const targetTime = video.duration * self.progress
          video.currentTime = targetTime
          onProgress?.(self.progress)
        }
      }
    })

    return () => {
      trigger.kill()
    }
  }, { scope: videoRef })

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
