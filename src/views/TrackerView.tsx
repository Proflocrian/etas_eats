import { HeartWatermark } from '../components/decor'
import { Placeholder } from './Placeholder'

export function TrackerView() {
  return (
    <div className="relative h-full overflow-hidden">
      <HeartWatermark />
      <Placeholder emoji="📋" title="Tracker" message="Coming soon." />
    </div>
  )
}
