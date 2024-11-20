import { ProfileContent } from './_components/profile-content'

export default function PageProfile() {
  return (
    <div className="form_custom">
      <h2 className="ttl_main fz-18">
        <span>
          <strong className="icon sz-24 icon-color-white flex-shrink">
            <i className="icon-user"></i>
          </strong>
          개인정보
        </span>
      </h2>
      <ProfileContent />
    </div>
  )
}
