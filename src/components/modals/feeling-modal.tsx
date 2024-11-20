'use client'

import { cn } from '@/lib/utils'
import { useModal } from '@/store/use-modal-store'

export const FeelingModal = () => {
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'feeling'

  return (
    <div className={cn('modal', isModalOpen && 'show')} id="modal_feeling">
      <div className="modal_dark modal_close" onClick={onClose}></div>
      <div className="modal_dialog sz-md">
        <div className="modal_content">
          <div className="modal_head">
            포켓등급
            <div className="btn_close modal_close" onClick={onClose}>
              <span className="icon sz-24">
                <i className="icon_close"></i>
              </span>
            </div>
          </div>
          <div className="modal_body">
            <div className="scrollbar">
              <div className="table_feeling">
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">★★★★★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    AA KK QQ JJ AKs
                  </div>
                </div>
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">
                        ★★★★
                        <div className="half">
                          <div>★</div>
                          <div>★</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    TT AQs AJs AK KQs
                  </div>
                </div>
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">★★★★</div>
                      <div className="viewed_stars">★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    ATs KJs AQ 99 QJs KTs
                  </div>
                </div>
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">
                        ★★★
                        <div className="half">
                          <div>★</div>
                          <div>★</div>
                        </div>
                      </div>
                      <div className="viewed_stars">★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    88 QTs A9s AJ JTs KQ A8s AT
                  </div>
                </div>
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">★★★</div>
                      <div className="viewed_stars">★★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    K9s A7s KJ A5s Q9s T9s 77 J9s A6s QJ A4s KT QT A3s K8s JT
                    A2s Q8s
                  </div>
                </div>
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">
                        ★★
                        <div className="half">
                          <div>★</div>
                          <div>★</div>
                        </div>
                      </div>
                      <div className="viewed_stars">★★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    T8s K7s 98s 66 J8s A9 K6s K5s A8
                  </div>
                </div>
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">★★</div>
                      <div className="viewed_stars">★★★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    87s 97s K4s Q7s T7s K9 J7s T9 55 Q6s Q9 K3s J9 A7 Q5s A5 K2s
                  </div>
                </div>
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">
                        ★
                        <div className="half">
                          <div>★</div>
                          <div>★</div>
                        </div>
                      </div>
                      <div className="viewed_stars">★★★★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    Q4s A6 T6s J6s A4 J5s K8 Q3s 44 T8 A3 J8 Q8 K7 A2 K6
                  </div>
                </div>
                <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    {/* <!-- ★★★★--> */}
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">★</div>
                      <div className="viewed_stars">★★★★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">그 외 전체</div>
                </div>
                {/* <div className="table_tr flex">
                  <div className="table_td flex-shrink">
                    <div className="viewed_stars flex">
                      <div className="viewed_stars__orange flex">
                        <div className="half">
                          <div>★</div>
                          <div>★</div>
                        </div>
                      </div>
                      <div className="viewed_stars">★★★★</div>
                    </div>
                  </div>
                  <div className="table_dd flex-grow fz-16">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout{' '}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
