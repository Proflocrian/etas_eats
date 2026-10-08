import { HeartWatermark } from '../components/decor'
import { Placeholder } from './Placeholder'

export function AboutView() {
  return (
    <div className="relative h-full overflow-hidden">
      <HeartWatermark />
      <Placeholder
        emoji="❓"
        title="About"
        message="Eta's Eats - a personal food and symptom diary."
      />
    </div>
  )
}
