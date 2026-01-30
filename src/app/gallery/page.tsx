
import Image from 'next/image';
import { GALLERY_IMAGES } from '@/lib/data';

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Tokyo Gallery
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          A visual journey through the streets, lights, and seasons of Tokyo.
        </p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 space-y-4">
        {GALLERY_IMAGES.map((image, idx) => (
          <div key={idx} className="relative break-inside-avoid overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={image.src}
              alt={image.alt}
              width={800}
              height={600}
              className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 flex items-end p-4">
              <span className="text-white font-medium">{image.alt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
