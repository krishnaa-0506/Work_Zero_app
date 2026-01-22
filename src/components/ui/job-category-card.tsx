import { HardHat, Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

interface JobCategoryCardProps {
  type: 'construction' | 'logistics'
  onSelect: (category: string) => void
  isSelected?: boolean
}

export function JobCategoryCard({ type, onSelect, isSelected }: JobCategoryCardProps) {
  const { t } = useLanguage()
  
  const config = {
    construction: {
      icon: HardHat,
      label: t.construction || 'Construction Jobs',
      color: 'from-blue-500 to-indigo-500',
      selectedColor: 'from-blue-600 to-indigo-600',
    },
    logistics: {
      icon: Truck,
      label: t.logistics || 'Logistics Jobs',
      color: 'from-cyan-500 to-blue-500',
      selectedColor: 'from-cyan-600 to-blue-600',
    },
  }

  const { icon: Icon, label, color, selectedColor } = config[type]

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
        isSelected ? 'ring-2 ring-primary' : ''
      )}
      onClick={() => onSelect(type)}
    >
      <CardContent className={cn(
        'p-6 bg-gradient-to-br text-white',
        isSelected ? selectedColor : color
      )}>
        <Icon className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-bold">{label}</h3>
      </CardContent>
    </Card>
  )
}
