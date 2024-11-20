'use client'

import { cn } from '@/lib/utils'
import { useModal } from '@/store/use-modal-store'
import { useParams } from 'next/navigation'

export const RuleModal = () => {
  const { isOpen, onClose, type } = useModal()

  const params = useParams()

  const isModalOpen = isOpen && type === 'rule'

  return (
    <div
      className={cn('modal', isModalOpen && 'show')}
      id={params?.tableId && 'modal_rule'}
    >
      <div className="modal_dark modal_close" onClick={onClose}></div>
      <div className="modal_dialog sz-lg">
        <div className="modal_content">
          <div className="modal_head">
            규칙
            <div className="btn_close modal_close" onClick={onClose}>
              <span className="icon sz-24">
                <i className="icon_close"></i>
              </span>
            </div>
          </div>
          <div className="modal_body">
            <div className="scrollbar">
              <h3 className="ttl color-primary text-up">
                {' '}
                <span>초기 테이블 설정</span>
              </h3>
              <div className="text">
                <p>- 플레이어 수: 2명에서 10명까지</p>
                <p>
                  - 딜러가 될 사람을 선택하고 딜러 카드를 이 사람 앞에 놓습니다.
                  공정성을 보장하기 위해 각 게임이 끝난 후 딜러 위치는 시계
                  방향으로 왼쪽에 있는 사람에게 이전됩니다. 따라서 모든
                  플레이어가 차례로 딜러가 됩니다..
                </p>
                <p>
                  - 딜러는 시계 방향으로 딜을 진행하며, 각 플레이어는 카드 2장을
                  테이블 중앙에 뒤집습니다..
                </p>
              </div>
              <br />
              <h3 className="ttl color-primary text-up">
                <span>포커 게임 개요</span>
              </h3>
              <div className="text">
                <p>
                  - 포커 게임에는 4개의 베팅 라운드가 포함됩니다.:
                  <strong className="color-main">
                    Fre Flop, Flop, Turn, River.{' '}
                  </strong>
                </p>
                <p>
                  - 각 베팅 라운드가 끝나면 모든 베팅은 다음과 같은 한 곳에
                  모아집니다. <strong className="color-main">Pot. </strong>
                  원칙적으로 베팅 라운드는 모든 플레이어의 베팅이 동일하고
                  누구도 다시 레이즈하지 않는 경우에만 종료됩니다..{' '}
                </p>
                <p>
                  - 4라운드 플레이 후, 가장 강한 패를 가진 플레이어가 승자가
                  됩니다. 그러나 실제 핸드는 언제든지 끝날 수 있습니다. 누군가가
                  레이즈하고 다른 모든 사람들이 폴드하면 레이즈한 사람이 승자가
                  되고 게임이 종료됩니다..
                </p>
                <p>
                  - 승자는 모든 사람의 전체 베팅에서 승리하게 됩니다.{' '}
                  <strong className="color-main">pot. </strong>승자가 다른
                  사람보다 먼저 모든 돈을 걸었을 경우{' '}
                  <strong className="color-main">(all- in) </strong>올인
                  시점까지만 팟에 있는 돈을 얻을 수 있습니다..
                </p>
              </div>
              <br />
              <h3 className="ttl color-primary text-up">
                {' '}
                <span>한 턴에 액션</span>
              </h3>
              <div className="text">
                매 턴마다 플레이어는 다음 행동 중 하나를 취할 권리가 있습니다.:
              </div>
              <br />
              <h4 className="color-main fw-700">카드 건너뛰기 (Fold)</h4>
              <div className="text">
                <p>
                  플레이어는 플레이를 멈추고 다음 게임을 기다립니다. 이 동작은
                  플레이어가 이길 가능성이 없는 나쁜 카드를 받았거나 플레이어가
                  게임을 계속하기 위해 상대방에게 더 많은 돈을 주고 싶지 않을 때
                  자주 발생합니다. 이전 베팅을 잃게 됩니다..
                </p>
              </div>
              <br />
              <h4 className="color-main fw-700">에 따르면 (Call)</h4>
              <div className="text">
                해당 게임을 따르기 위해 이전 플레이어가 베팅한 금액과 동일한
                금액을 지출합니다..
              </div>
              <br />
              <h4 className="color-main fw-700">내기 (Bet)</h4>
              <div className="text">
                아직 아무도 베팅하지 않았을 때 베팅할 수 있습니다. 그 때,
                계속해서 플레이하고 싶은 다른 플레이어들은 최소한 베팅한
                금액만큼 플레이해야 합니다. (Call) 아니면 그 이상을 걸거나
                (Raise) 또는 접어 (Fold).
              </div>
              <br />
              <h4 className="color-main fw-700">에게 (Raise)</h4>
              <div className="text">
                <p>
                  누군가가 베팅을 하면 레이즈라는 추가 베팅을 선택하게 됩니다..
                </p>
                <p>
                  예: 처음에 두 명의 플레이어 A와 B가 각각 250을 베팅했고 총
                  금액은 500입니다. 플레이어 A는 추가로 250을 레이즈하기로
                  선택했습니다. 따라서 총 금액은 750입니다. 이제 플레이어 B는
                  선택할 수 있는 3개의 액션이 있거나 콜을 한 다음 250을
                  추가합니다. 플레이어 A가 레이즈하거나 더 많이 레이즈하려면
                  플레이어 A보다 더 많이 베팅해야 합니다(예: 350 또는 폴드).
                  (Fold).
                </p>
              </div>
              <br />
              <h4 className="color-main fw-700">모든 (All- in)</h4>
              <div className="text">
                이때 돈을 전부 걸고 베팅하는 것을 올인이라고도 합니다. 모두
                모으고 게임이 계속되면, 여러분이 할 수 있는 일은 편안히 앉아서
                지켜보는 것뿐입니다. 게임이 끝나면 카드가 공개되어 승자와 패자를
                결정합니다. 결국 당신이 승자가 된다면, 당신은 모두 콜한
                시점까지의 팟에 있는 금액만 받게 됩니다..
              </div>
              <br />
              <h4 className="color-main fw-700">보다 (Check)</h4>
              <div className="text">
                아무도 배팅하지 않을 때는 배팅하지 않고 다른 플레이어의 행동을
                기다립니다..
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
