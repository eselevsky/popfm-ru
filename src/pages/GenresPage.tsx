import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { StationTag } from '@shared/types';
import { motion } from 'framer-motion';
import { AlertTriangle, Music, Loader } from 'lucide-react';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { Helmet } from 'react-helmet-async';
import { useDebounce } from 'react-use';
import { translateGenre } from '@/lib/localization';
const LIMIT = 36;
function GenreGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 18 }).map((_, i) => (
        <Skeleton key={i} className="h-24 bg-retro-primary/10" />
      ))}
    </div>
  );
}
export function GenresPage() {
  const [tags, setTags] = useState<StationTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  // State for infinite scroll
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const fetchMoreTags = useCallback(() => {
    if (isFetchingMore || !hasMore) return;
    fetchTags(false);
  }, [isFetchingMore, hasMore, fetchTags]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreTags();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, fetchMoreTags]);
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);
  const fetchTags = useCallback(async (isNewSearch: boolean) => {
    if (isNewSearch) {
      setIsLoading(true);
    } else {
      if (isFetchingMore) return;
      setIsFetchingMore(true);
    }
    setError(null);
    try {
      const currentOffset = isNewSearch ? 0 : offset;
      const params = new URLSearchParams();
      params.append('order', 'stationcount');
      params.append('reverse', 'true');
      params.append('hidebroken', 'true');
      params.append('limit', String(LIMIT));
      params.append('offset', String(currentOffset));
      if (debouncedSearchTerm) {
        params.append('name', debouncedSearchTerm);
      }
      const data = await api<StationTag[]>(`/api/radio/tags?${params.toString()}`);
      if (isNewSearch) {
        setTags(data);
        setOffset(data.length);
      } else {
        // Append new tags and update the offset for the next fetch
        setTags(prevTags => [...prevTags, ...data]);
        setOffset(prevOffset => prevOffset + data.length);
      }
      setHasMore(data.length === LIMIT);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [offset, debouncedSearchTerm, isFetchingMore]);
  // Effect for new searches
  useEffect(() => {
    // This effect should only run when the search term changes.
    // We disable the lint rule because adding fetchTags would cause
    // this to re-run on every pagination fetch, which is incorrect.
    fetchTags(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return (
    <AppLayout>
      <Helmet>
        <title>Поиск по жанрам - popfm.ru</title>
        <meta name="description" content="Находите онлайн-радиостанции, просматривая огромную коллекцию жанров, от рока и поп-музыки до джаза и классики, на popfm.ru." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-pixel text-4xl md:text-5xl text-retro-primary mb-2">Поиск по жанрам</h1>
            <p className="text-lg text-retro-accent/80 mb-8">Находите станции ваших любимых жанров.</p>
          </motion.div>
          <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Найти жанр..." />
          {isLoading && <GenreGridSkeleton />}
          {error && (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-retro-background/50 border border-red-500/50 p-8">
              <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
              <h2 className="font-pixel text-2xl text-red-400 mb-2">Ошибка загрузки жанров</h2>
              <p className="text-retro-accent/80 max-w-md">{error}</p>
            </div>
          )}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {tags.map((tag) => (
                  <Link
                    to={`/genres/${encodeURIComponent(tag.name)}`}
                    key={tag.name}
                    className="group relative flex flex-col items-center justify-center text-center p-4 bg-black/30 border-2 border-retro-primary/30 hover:border-retro-secondary hover:shadow-glow transition-all duration-300 h-24"
                  >
                    <Music className="w-6 h-6 text-retro-secondary mb-2 transition-transform group-hover:scale-110" />
                    <h3 className="font-mono text-sm font-bold text-retro-accent capitalize line-clamp-2">{translateGenre(tag.name)}</h3>
                    <p className="text-xs text-retro-secondary/70">{tag.stationcount} станций</p>
                  </Link>
                ))}
              </div>
              <div ref={lastElementRef} className="h-10 flex justify-center items-center">
                {isFetchingMore && <Loader className="w-8 h-8 text-retro-secondary animate-spin" />}
              </div>
              {!hasMore && tags.length > 0 && (
                <div className="text-center text-retro-secondary/70 mt-8">
                  <p>-- Конец списка --</p>
                </div>
              )}
              {tags.length === 0 && !isLoading && (
                 <div className="text-center py-16">
                    <h2 className="font-pixel text-2xl text-retro-secondary mb-2">Жанры не найдены</h2>
                    <p className="text-retro-accent/80">Попробуйте другой поисковый запрос.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}