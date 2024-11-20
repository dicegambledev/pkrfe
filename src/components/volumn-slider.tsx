'use client'

import { useCallback, useEffect, useState } from 'react'

import type { SoundLevel } from '@/public/icons'
import { SoundIcon } from '@/public/icons'

import { Slider } from '@/components/ui/slider'
import { useVolume } from '@/store/use-volume'

export const VolumeSlider = () => {
  const { volume, setVolume } = useVolume()
  const [trackVolume, setTrackVolume] = useState<number>(volume)
  const [previousVolume, setPreviousVolume] = useState<number>(volume)
  const [volumeLevel, setVolumeLevel] = useState<SoundLevel>('medium')
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const volumeLevelFilter = useCallback((value: number): SoundLevel => {
    if (+value === 0) {
      return 'mute'
    }
    if (+value < 0.33) {
      return 'low'
    }
    if (+value < 0.66) {
      return 'medium'
    }
    return 'high'
  }, [])

  const toggleMute = (): void => {
    if (volume === 0) {
      setIsMuted(false)
      setVolume(previousVolume)
      setTrackVolume(previousVolume)
      setVolumeLevel(volumeLevelFilter(previousVolume))
    } else {
      setIsMuted(true)
      setPreviousVolume(volume)
      setVolume(0)
      setTrackVolume(0)
      setVolumeLevel('mute')
    }
  }

  const handleMouseUp = (value: number): void => {
    setVolumeLevel(volumeLevelFilter(value))
    setVolume(value)
    setTrackVolume(value)
    handleMuted()
  }

  const handleVolumeChange = (value: number): void => {
    setVolumeLevel(volumeLevelFilter(value))
    setTrackVolume(value)
    handleMuted()
  }

  const handleChangeMediaElement = () => {
    const mediaElements = document.querySelectorAll('audio, video')
    mediaElements.forEach(media => {
      const mediaElement = media as HTMLMediaElement

      mediaElement.volume = volume

      mediaElement.onvolumechange = function () {
        mediaElement.volume = volume
      }
    })
  }

  const handleValue = (): number => {
    if (isMuted) {
      return volume
    } else {
      return trackVolume
    }
  }

  const handleMuted = () => {
    if (trackVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  useEffect(() => {
    const mediaElements = document.querySelectorAll('audio, video')
    mediaElements.forEach(media => {
      const mediaElement = media as HTMLMediaElement
      mediaElement.muted = isMuted
    })
  }, [isMuted])

  useEffect(() => {
    handleMuted()
  }, [volume])

  useEffect(() => {
    handleChangeMediaElement()
  }, [volume])

  return (
    <div className="flex items-center justify-end gap-x-4 ">
      <div className="flex w-full min-w-[125px] items-center gap-x-2">
        <div
          className="flex cursor-pointer justify-center text-white"
          onClick={toggleMute}
        >
          <SoundIcon level={volumeLevel} />
        </div>

        <Slider
          value={handleValue()}
          step={0.01}
          maxValue={1}
          onChange={handleVolumeChange}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  )
}
