import { escalationLabels, type Conversation } from "../types/conversation"

export type FilterValue = "all" | Conversation["escalationReason"]

type Props = {
  value: FilterValue
  onChange: (value: FilterValue) => void
}

const options: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "angry_customer", label: escalationLabels.angry_customer },
  { value: "low_csat", label: escalationLabels.low_csat },
  { value: "edge_case", label: escalationLabels.edge_case }
]

export default function EscalationFilter({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-hide border-b border-gray-100">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
            value === option.value
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
