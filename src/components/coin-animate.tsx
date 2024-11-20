'use client'

import { useVolume } from '@/store/use-volume'
import sound from '@/utils/contants/sound'
import { useEffect } from 'react'
import { useAudio } from 'react-use'

type CoinAnimateProps = {}

export const CoinAnimate = ({}: CoinAnimateProps) => {
  const { volume } = useVolume()
  const [audio, _, controls] = useAudio({ src: sound.soundCoin })

  useEffect(() => {
    controls.volume(volume)
    controls.play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="wallet">
      {audio}
      <div
        className="coin coin--animated"
        style={
          {
            '--coin-to-x': 'calc(-100px + 24px)',
            '--coin-to-y': 'calc(-105px + 24px)',
            '--coin-delay': '0.3s',
          } as React.CSSProperties as any
        }
      ></div>
      <div
        className="coin coin--animated"
        style={
          {
            '--coin-to-x': 'calc(-70px + 24px)',
            '--coin-to-y': '-90px',
            '--coin-delay': '0.1s',
          } as React.CSSProperties as any
        }
      ></div>
      <div
        className="coin coin--animated"
        style={
          {
            '--coin-to-x': 'calc(-30px + 24px)',
            '--coin-to-y': '-125px',
            '--coin-delay': '0s',
          } as React.CSSProperties as any
        }
      ></div>
      <div
        className="coin coin--animated"
        style={
          {
            '--coin-to-x': 'calc(10px + 24px)',
            '--coin-to-y': '-130px',
            '--coin-delay': '0.2s',
          } as React.CSSProperties as any
        }
      ></div>
      <div
        className="coin coin--animated"
        style={
          {
            '--coin-to-x': 'calc(30px + 24px)',
            '--coin-to-y': '-100px',
            '--coin-delay': '0.1s',
          } as React.CSSProperties as any
        }
      ></div>
      <div
        className="coin coin--animated"
        style={
          {
            '--coin-to-x': 'calc(70px + 24px)',
            '--coin-to-y': '-95px',
            '--coin-delay': '0.4s',
          } as React.CSSProperties as any
        }
      ></div>
      <div
        className="coin coin--animated"
        style={
          {
            '--coin-to-x': 'calc(100px + 24px)',
            '--coin-to-y': '-100px',
            '--coin-delay': '0.2s',
          } as React.CSSProperties as any
        }
      ></div>
    </div>
  )
}
