import { RotateCcw } from 'lucide-react'
import { NewPasswordContent } from './_components/new-password-content'

const NewPasswordPage = () => {
  return (
    <div className="form_custom">
      <h2 className="ttl_main fz-18">
        <span>
          <RotateCcw size={24} />
          새 비밀번호
        </span>
      </h2>
      <NewPasswordContent />
    </div>
  )
}

export default NewPasswordPage
