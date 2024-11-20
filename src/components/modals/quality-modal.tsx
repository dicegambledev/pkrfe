'use client'

import { cn } from '@/lib/utils'
import { useModal } from '@/store/use-modal-store'
import { X } from 'lucide-react'
import Image from 'next/image'

const contents = [
  {
    name: '로얄 스트레이트 플러쉬',
    cards: ['a_spades', 'k_spades', 'q_spades', 'j_spades', 'ten_spades'],
    desc: '같은 무늬의 A,K,Q,J,10',
  },
  {
    name: '스트레이트 플러쉬',
    cards: [
      'eight_hearts',
      'seven_hearts',
      'six_hearts',
      'five_hearts',
      'four_hearts',
    ],
    desc: '같은 무늬의 연속된 숫자 5,4,3,2,A 스트레이트 플러쉬가 가장 낮음',
  },
  {
    name: '포카드',
    cards: ['seven_spades', 'seven_hearts', 'seven_diamonds', 'seven_clubs'],
    desc: '같은 숫자, 다른무늬 4장',
  },
  {
    name: '풀하우스',
    cards: [
      'five_spades',
      'five_diamonds',
      'five_clubs',
      'two_hearts',
      'two_spades',
    ],
    desc: '같은 숫자 3장 + 같은 숫자 2장',
  },
  {
    name: '플러쉬',
    cards: [
      'a_spades',
      'five_spades',
      'three_spades',
      'j_spades',
      'eight_spades',
    ],
    desc: '같은 무늬의 카드 5장',
  },
  {
    name: '스트레이트',
    cards: [
      'nine_spades',
      'eight_hearts',
      'seven_diamonds',
      'six_clubs',
      'five_spades',
    ],
    desc: '무늬에 관계없이 연속된 숫자 5장의 카드 *AK,Q.J.10가 가장 높음 *5,4,3,2,A가 가장 낮음',
  },
  {
    name: '트리플',
    cards: ['two_spades', 'two_hearts', 'two_diamonds'],
    desc: '같은 숫자 3장으로 이루어진 카드',
  },
  {
    name: '투페어',
    cards: ['eight_spades', 'eight_hearts', 'six_diamonds', 'six_clubs'],
    desc: '2종류의 같은 숫자 2장으로 이루어진 카드 4장',
  },
  {
    name: '원페어',
    cards: ['six_spades', 'six_hearts'],
    desc: '같은 숫자 2장의 카드',
  },
  {
    name: '노페어',
    cards: [],
    desc: '아무 족보도 만들어지지 않는 카드',
  },
]

export const QualityModal = () => {
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'quality'

  return (
    <div className={cn('modal', isModalOpen && 'show')} id="modal_quality">
      <div className="modal_dark modal_close" onClick={onClose}></div>
      <div className="modal_dialog sz-md">
        <div className="modal_content ">
          <div className="modal_head">
            족보
            <div className="btn_close modal_close" onClick={onClose}>
              <span className="icon sz-24">
                <i className="icon_close"></i>
              </span>
            </div>
          </div>
          <div className="modal_body">
            <div className="scrollbar">
              <div className="table_quality">
                <div className="tables">
                  <div className="tables_head">
                    <div className="tables_td">수</div>
                    <div className="tables_td">홀덤족보</div>
                    <div className="tables_td">그림</div>
                    <div className="tables_td">해당족보</div>
                  </div>
                  <div className="tables_body">
                    {contents.map((item, i) => (
                      <div className="tables_tr" key={i}>
                        <div className="tables_td">{i + 1}</div>
                        <div className="tables_td">{item.name}</div>
                        <div className="tables_td">
                          <div className="list_poker flex">
                            {item.cards.map((card, i) => (
                              <div className="item" key={i}>
                                <div className="wrap">
                                  <Image
                                    src={`/images/pocker/${card}.png`}
                                    alt="Card"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-auto h-full"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="tables_td">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
