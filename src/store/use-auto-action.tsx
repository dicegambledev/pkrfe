import { create } from 'zustand'

type checkedType =
  | 'check'
  | 'fold'
  | 'call'
  | 'raise'
  | 'allIn'
  | 'quarter'
  | 'half'
  | 'full'
  | ''

interface AutoActionProps {
  isChecked: checkedType
  callAmount: number
  setAutoAction: ({
    isChecked,
    callAmount,
  }: {
    isChecked?: checkedType
    callAmount?: number
  }) => void
}

export const useAutoAction = create<AutoActionProps>()(set => ({
  isChecked: '',
  callAmount: 0,
  setAutoAction: ({ isChecked, callAmount }) => {
    set(state => ({
      ...state,
      isChecked: isChecked ?? state.isChecked,
      callAmount: callAmount ?? state.callAmount,
    }))
  },
}))
