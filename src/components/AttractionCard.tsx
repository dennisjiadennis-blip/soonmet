
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { Attraction } from '@/lib/data';

interface AttractionCardProps {
  attraction: Attraction;
}

export function AttractionCard({ attraction }: AttractionCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg dark:bg-zinc-900">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={attraction.imageUrl}
          alt={attraction.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur-md">
          {attraction.category}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {attraction.name}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span>{attraction.rating}</span>
          </div>
        </div>
        
        <div className="mb-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <MapPin className="h-3.5 w-3.5" />
          <span>{attraction.location}</span>
        </div>
        
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {attraction.description}
        </p>
      </div>
    </div>
  );
}
