import { CarFront } from 'lucide-react'

function BrandMark() {
  return (
    <span className="flex items-center gap-3 text-ink">
      <span className="grid size-9 place-items-center rounded-sm bg-ink text-accent sm:size-10">
        <CarFront aria-hidden="true" size={21} strokeWidth={1.7} />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.05em] sm:text-[17px]">
        CarQeemat
      </span>
    </span>
  )
}

export default BrandMark
