import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "../icons"

export type SortType = "default" | "highToLow" | "lowToHigh"

type Props = {
  value: SortType
  onChange: (value: SortType) => void
}

const options: { value: SortType; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "highToLow", label: "High → Low" },
  { value: "lowToHigh", label: "Low → High" }
]

export default function SortDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const currentLabel = options.find(o => o.value === value)?.label

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 border border-gray-300 rounded-full pl-4 pr-3 py-1.5 text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500"
      >
        {currentLabel}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                option.value === value ? "text-blue-600 font-medium" : "text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
