import { CustomToastProps } from '@/types'

export const CustomToast = ({ messages, type, onClose }: CustomToastProps) => {
  return (
    <div className={`toast_item toast_${type === 'info' ? 'info2' : type}`}>
      <span className="icon sz-20 flex-shrink">
        <i className={`icon-${type}`}> </i>
      </span>
      <div className="text flex-grow">{messages}</div>
      <div className="btn_close icon sz-20" onClick={onClose}>
        <i className="icon-close"></i>
      </div>
    </div>
  )
}
