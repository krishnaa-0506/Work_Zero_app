import { Globe, User2, Star, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  userName: string
  userPhoto?: string
  trustScore: number
  isAadhaarVerified: boolean
}

export function TopBar({ userName, userPhoto, trustScore, isAadhaarVerified }: TopBarProps) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  const renderStars = (score: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < score ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="w-full bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={userPhoto} alt={userName} />
          <AvatarFallback>
            <User2 className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{userName}</span>
            {isAadhaarVerified && (
              <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                ✅ Aadhaar Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {renderStars(trustScore)}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/language')}
          className="text-muted-foreground"
        >
          <Globe className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/notifications')}
          className="text-muted-foreground"
        >
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
