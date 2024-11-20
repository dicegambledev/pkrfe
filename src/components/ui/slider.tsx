'use client'

import { cn } from '@/lib/utils'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { Fragment } from 'react'
import { useMedia } from 'react-use'
import { twMerge } from 'tailwind-merge'

interface SliderProps {
  value?: number
  maxValue?: number
  minValue?: number
  step?: number
  onChange?: (value: number) => void
  onMouseUp?: (value: number) => void
  className?: string
}

export const Slider = ({
  className,
  value = 0,
  maxValue = 100,
  minValue = 0,
  step = 1,
  onChange,
  onMouseUp,
}: SliderProps) => {
  const isPortrait = useMedia(
    '(min-width: 320px) and (orientation: portrait)',
    false
  )
  const isLandscape = useMedia(
    '(max-width: 1023px) and (orientation: landscape)',
    false
  )

  const handleMouseUp = (newValue: number[]): void => {
    onMouseUp?.(newValue[0] as number)
  }
  const handleChange = (newValue: number[]): void => {
    onChange?.(newValue[0] as number)
  }

  return (
    <SliderPrimitive.Root
      className={twMerge(
        'group  relative flex items-center select-none cursor-pointer touch-none w-full h-[30px]',
        (isPortrait || isLandscape) && '',
        className
      )}
      defaultValue={[0]}
      value={[value]}
      onValueChange={handleChange}
      onValueCommit={handleMouseUp}
      max={maxValue}
      min={minValue}
      step={step}
      orientation={isPortrait ? 'vertical' : 'horizontal'}
    >
      <SliderPrimitive.Track
        className={cn('relative  h-[1px] grow rounded-full bg-neutral-600 ')}
      >
        <SliderPrimitive.Range
          className={cn(
            'absolute h-[3px] -top-1/2 slider-range rounded-full bg-yellow-linear ',
            isPortrait && '-translate-y-0.5'
          )}
          style={{
            width: isPortrait ? `${(value / maxValue) * 100}%` : 'auto',
          }}
        ></SliderPrimitive.Range>
      </SliderPrimitive.Track>
      <Fragment>
        <SliderPrimitive.Thumb
          className={cn(
            'block size-[10px] rounded-full bg-yellow-linear  transition focus:outline-none ',
            isPortrait && 'hidden'
          )}
        />
      </Fragment>
    </SliderPrimitive.Root>
  )
}
