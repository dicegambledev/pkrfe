'use client'

import { useBrightness } from '@/store/use-brightness'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Sun, SunDim, SunMedium } from 'lucide-react'
import { cn } from '@/lib/utils'

const BrightnessLevels = ['normal', 'dim', 'bright']

export const ToggleBrightness = () => {
  const { brightness, setBrightness } = useBrightness()

  const onBrightnessClick = (type: 'dim' | 'normal' | 'bright') => {
    setBrightness(type)
  }

  useEffect(() => {
    const brightnessLevel =
      brightness === 'dim' ? 0.7 : brightness === 'normal' ? 1 : 1.5
    document.documentElement.style.setProperty(
      '--brightness-level',
      brightnessLevel.toString()
    )
  }, [brightness])

  return (
    <div className="item border-left">
      <div className="block_light flex">
        <div
          onClick={() => onBrightnessClick('dim')}
          className={cn('light light1', brightness === 'dim' && 'active')}
        >
          <span className="icon icon-color-white sz-20">
            <i className="icon-light1"></i>
          </span>
        </div>
        <div
          onClick={() => onBrightnessClick('normal')}
          className={cn('light light2', brightness === 'normal' && 'active')}
        >
          <span className="icon icon-color-white sz-20">
            <i className="icon-light1"></i>
          </span>
        </div>
        <div
          onClick={() => onBrightnessClick('bright')}
          className={cn('light light3', brightness === 'bright' && 'active')}
        >
          <span className="icon icon-color-white sz-20">
            <i className="icon-light2"></i>
          </span>
        </div>
      </div>
    </div>
  )
}
