// A small No/Yes segmented switch. Yes is highlighted in the brand colour.
export function YesNoSwitch({
  value,
  onChange,
  size = 'md',
}: {
  value: boolean
  onChange: (value: boolean) => void
  size?: 'sm' | 'md'
}) {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-0.5 text-sm'
  return (
    <div className="flex shrink-0 rounded-full border border-neutral-300 p-0.5">
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={!value}
        className={`rounded-full ${pad} ${
          !value ? 'bg-neutral-700 font-semibold text-white' : 'text-neutral-500'
        }`}
      >
        No
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={value}
        className={`rounded-full ${pad} ${
          value ? 'bg-[#e5556e] font-semibold text-white' : 'text-neutral-500'
        }`}
      >
        Yes
      </button>
    </div>
  )
}
