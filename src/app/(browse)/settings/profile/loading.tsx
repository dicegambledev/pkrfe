import { Loader } from 'lucide-react'

const Loading = () => {
  return (
    <div className="form_custom">
      <h2 className="ttl_main fz-18">
        <span>
          <strong className="icon sz-24 icon-color-white flex-shrink">
            <i className="icon-cash"></i>
          </strong>
          입출금
        </span>
      </h2>
      <div className="row flex flex-center gapy-40 mt-16 ">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  )
}

export default Loading
