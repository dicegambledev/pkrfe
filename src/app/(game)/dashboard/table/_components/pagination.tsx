'use client'

import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  pageCount: number
}

export const Pagination = ({ pageCount = 10 }: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const [pageIndex, setPageIndex] = useState(1)

  const handleNavigate = (number: number) => {
    setPageIndex(number)
    return `${pathname}?page=${number}`
  }

  const handlePrev = () => {
    router.push(handleNavigate(pageIndex - 1))
  }

  const handleNext = () => {
    router.push(handleNavigate(pageIndex + 1))
  }

  const renderPageNumber = (index: number) => (
    <li
      key={index}
      className="page-number"
      onClick={() => router.push(handleNavigate(index + 1))}
    >
      <span className={`${pageIndex === index + 1 && 'current'}`}>
        {index + 1}
      </span>
    </li>
  )

  return (
    <div className="mt-12">
      <nav className="pagination mt-16 flex flex-end ">
        <ul className="page-numbers nav-pagination links text-center">
          <Button
            className="size-[30px] p-0"
            onClick={handlePrev}
            disabled={pageIndex === 1}
          >
            <span className="prev page-number">
              <span className="icon sz-16 icon-color-white">
                <i className="icon-arr_left"></i>
              </span>
            </span>
          </Button>
          {Array.from({ length: pageCount }).map((_, index) => {
            // Always show the first two and last two pages, and any page within two of the current page
            if (
              index < 2 ||
              index > pageCount - 3 ||
              Math.abs(pageIndex - index - 1) <= 2
            ) {
              return renderPageNumber(index)
            }
            // Show ellipsis only when it's not already shown in the previous index and it's not next to the current page range
            else if (
              (index === 2 && index !== pageIndex - 1) ||
              (index === pageCount - 3 && index !== pageIndex + 1)
            ) {
              return (
                <li
                  key={index}
                  className="page-number dots hover:no-underline cursor-default"
                >
                  <span>...</span>
                </li>
              )
            }
          })}
          <Button
            className="size-[30px] p-0"
            onClick={handleNext}
            disabled={pageIndex === pageCount}
          >
            <span className="next page-number icon-color-white">
              <span className="icon sz-16">
                <i className="icon-arr_right"></i>
              </span>
            </span>
          </Button>
        </ul>
      </nav>
    </div>
  )
}

export default Pagination
