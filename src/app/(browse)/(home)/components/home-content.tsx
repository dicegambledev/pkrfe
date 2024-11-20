'use client'

import { UserBoard } from '@/components/user-board'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import Link from 'next/link'
import { signOut } from '@/auth'
import { getSession } from 'next-auth/react'

interface HomeContentProps {}

const textArray = [
  'Lorem Ipsum',
  'Translations',
  'The standard Lorem',
  'Finibus Bonorum',
]

export const HomeContent = ({}: HomeContentProps) => {
  const [textArrayIndex, setTextArrayIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  const textWrapperRef = useRef<HTMLDivElement>(null)
  const typedTextRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (textWrapperRef.current && textWrapperRef.current.textContent) {
      textWrapperRef.current.innerHTML =
        textWrapperRef.current.textContent.replace(
          /\S/g,
          "<span className='letter'>$&</span>"
        )

      anime
        .timeline({ loop: true })
        .add({
          targets: '.text_box .letter',
          scale: [0, 1],
          duration: 1500,
          elasticity: 600,
          delay: (el, i) => 45 * (i + 1),
        })
        .add({
          targets: '.text_box',
          opacity: 0,
          duration: 1000,
          easing: 'easeOutExpo',
          delay: 1000,
        })
    }
  }, [])

  const type = () => {
    if (charIndex < textArray[textArrayIndex].length) {
      cursorRef.current?.classList.remove('blink')
      if (typedTextRef.current) {
        typedTextRef.current.textContent +=
          textArray[textArrayIndex].charAt(charIndex)
      }
      setCharIndex(charIndex + 1)
      setTimeout(type, 120)
    } else {
      cursorRef.current?.classList.add('blink')
      setTimeout(erase, 1000)
    }
  }

  const erase = () => {
    if (charIndex > 0) {
      cursorRef.current?.classList.remove('blink')
      if (typedTextRef.current) {
        typedTextRef.current.textContent = textArray[textArrayIndex].slice(
          0,
          charIndex - 1
        )
      }
      setCharIndex(charIndex - 1)
      setTimeout(erase, 80)
    } else {
      cursorRef.current?.classList.add('blink')
      setTextArrayIndex((textArrayIndex + 1) % textArray.length)
      setTimeout(type, 1000)
    }
  }

  return (
    <div className="boding_main flex-wrap">
      <div className="container">
        <div className="row py-24 gapy-24 ">
          <div className="col-12 col-md-6 col-lg-4 hidden md:!block">
            <UserBoard />
          </div>
          <div className="col-12 col-md-6 col-lg-4 pt-8">
            <div className="block_noti h-full">
              <div className="frame">
                <div className="number_count">5</div>
                <svg
                  className="bell"
                  width="50px"
                  height="54px"
                  viewBox="0 0 50 54"
                >
                  <path d="M1.13063517,45.0453694 C1.88439195,45.7991262 2.80138269,46.1760046 3.82399539,46.1760046 L17.2955975,46.1760046 C17.2955975,48.331653 18.0493543,50.110423 19.5592683,51.6179365 C21.0667819,53.1254501 22.8983629,53.8816074 25.0012002,53.8816074 C27.1544481,53.8816074 28.9332181,53.1254501 30.4431322,51.6179365 C31.9506457,50.110423 32.7044025,48.331653 32.7044025,46.1760046 L46.1760046,46.1760046 C47.1986173,46.1760046 48.115608,45.7991262 48.8693648,45.0453694 C49.6231216,44.2892122 50,43.3746219 50,42.3496087 C46.1760046,39.1185367 43.3194104,35.1313073 41.379807,30.3879207 C39.4402036,25.6469346 38.4704018,20.6370925 38.4704018,15.408805 C38.4704018,12.0697105 37.5006001,9.48197225 35.6138077,7.54236881 C33.6742042,5.54995439 31.033655,4.41931922 27.6945605,3.98722934 C27.8553939,3.66316194 27.9106054,3.28628355 27.9106054,2.90940516 C27.9106054,2.10043689 27.639349,1.40189159 27.0488262,0.86177925 C26.5087138,0.268855922 25.807768,0 25.0012002,0 C24.192232,0 23.5464977,0.268855922 23.0063853,0.86177925 C22.413462,1.40189159 22.1446061,2.10043689 22.1446061,2.90940516 C22.1446061,3.28628355 22.1974171,3.66316194 22.360651,3.98722934 C19.019156,4.41931922 16.3786068,5.54995439 14.4390033,7.54236881 C12.4993999,9.48197225 11.5295982,12.0697105 11.5295982,15.408805 C11.5295982,20.6370925 10.5597964,25.6469346 8.620193,30.3879207 C6.68058956,35.1313073 3.82399539,39.1185367 0,42.3496087 C0,43.3746219 0.376878391,44.2892122 1.13063517,45.0453694 L1.13063517,45.0453694 Z M20.2050026,45.6911037 C20.52907,45.6911037 20.6899035,45.8519372 20.6899035,46.1760046 C20.6899035,47.3618513 21.1195929,48.384464 21.9837726,49.1934322 C22.7903404,50.0552115 23.8153536,50.4873014 25.0012002,50.4873014 C25.3228672,50.4873014 25.4861011,50.6481348 25.4861011,50.9722022 C25.4861011,51.2938691 25.3228672,51.4571031 25.0012002,51.4571031 C23.5464977,51.4571031 22.3054395,50.9169907 21.2828268,49.894378 C20.2578136,48.8693648 19.7201018,47.6307072 19.7201018,46.1760046 C19.7201018,45.8519372 19.8809352,45.6911037 20.2050026,45.6911037 L20.2050026,45.6911037 Z"></path>
                </svg>
              </div>
              <div className="text_box mt-16" ref={textWrapperRef}>
                <div className="text_wrapper">
                  <div className="letters">
                    어떤 단계 든 , 아무리 작은 것이라 도 앞으로 나아가는 것이
                    매우 쉽습니다 . 우리 의 꿈 . 앞으로는 끊임 없는 단호한 판단
                    을 통해 계속 해서 전진 하세요 .가장 작은 문제 는 더 큰 문제
                    로 이어지는 길 에서 승리 하는 것 입니다.
                  </div>
                </div>
              </div>
              <a className="box__link button-animation mt-16" href="#">
                모두보기<span></span>
                <span></span>
                <span></span>
                <span></span>
              </a>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 pt-8">
            <div className="block_support h-full flex flex-center flex-midle">
              <div className="content">
                <h3 className="title text-center fw-700 fz-24 color-main">
                  문의하기
                </h3>
                <div className="text-center fz-12 mt-8">
                  Neque porro quisquam est qui dolorem
                </div>
                <ul className="flex flex-center gap-8 mt-16">
                  <li className="p-16">
                    <a className="block" href="">
                      <div className="icon sz-24 icon-color-white">
                        <i className="icon-email"></i>
                      </div>
                    </a>
                  </li>
                  <li className="p-16">
                    <a className="block" href="">
                      <div className="icon sz-24 icon-color-white">
                        <i className="icon-facebook"></i>
                      </div>
                    </a>
                  </li>
                  <li className="p-16">
                    <a className="block" href="">
                      <div className="icon sz-24 icon-color-white">
                        <i className="icon-telegram"></i>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-8 ">
            <div className="banner_play ">
              <svg>
                <filter id="noiseFilter2">
                  <feturbulence
                    type="fractalNoise"
                    baseFrequency="0.6"
                    stitchTiles="stitch"
                  ></feturbulence>
                </filter>
                <clipPath id="rounded-clip">
                  <rect
                    x="0"
                    y="0"
                    width="300"
                    height="300"
                    rx="20"
                    ry="20"
                  ></rect>
                </clipPath>
              </svg>
              <div className="area">
                <div className="context">
                  <p>
                    <span className="animate-aitf">모두의홀덤 </span>
                  </p>
                  <div className="text_typed">
                    Neque porro quisquam est qui dolorem{' '}
                    <span className="typed-text" ref={typedTextRef}></span>
                    <span className="cursor blink" ref={cursorRef}></span>
                  </div>
                  <div className="flex flex-center mt-24">
                    <Link
                      className="item btn_play flex flex-midle gap-12 fz-20"
                      href="/dashboard/table"
                    >
                      <div className="icon flex-shrink sz-24">
                        <i className="icon-play icon-color-white"></i>
                      </div>
                      <span className="color-white">게임 플레이</span>
                    </Link>
                  </div>
                </div>
                <ul className="circles">
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <a className="imgDrop block_points h-full" href="#">
              <Image
                src="/images/banner_point.png"
                alt="image alt"
                width={0}
                height={0}
                sizes="100vw"
                className="w-auto h-full object-cover"
              />
              <div className="box__link button-animation text-center">
                보기 클릭<span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="block_footer pt-32">
        <div className="container">
          <div className="row gapy-24 ">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="ttl_sub">
                {' '}
                <span>게임 규칙 용어</span>
              </div>
              <ul className="list_btn mt-20">
                <li>
                  <a href="#">
                    {' '}
                    <span className="text">이용 & 약관</span>
                    <span className="arrow"></span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    {' '}
                    <span className="text">포커 규칙</span>
                    <span className="arrow"></span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="ttl_sub">
                {' '}
                <span>쿠폰포인트 교환</span>
              </div>
              <a className="bnr_link bnr_points mt-20" href="#">
                클릭<b>포인트</b>
              </a>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="ttl_sub">
                {' '}
                <span>다운로드</span>
              </div>
              <a className="bnr_link bnr_download mt-20" href="">
                클릭<b>다운로드</b>
              </a>
            </div>
          </div>
        </div>
        <address className="mt-32">© 2024 Copyright by dev</address>
      </div>
    </div>
  )
}
