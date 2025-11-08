import { Link, NavLink } from 'react-router-dom';
import { Radio, Star, Globe, Music, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
const navItems = [
  { href: '/', label: 'Главная', icon: Radio },
  { href: '/genres', label: 'Жанры', icon: Music },
  { href: '/countries', label: 'Страны', icon: Globe },
  { href: '/favorites', label: 'Избранное', icon: Star },
];
export function AppHeader() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 px-3 py-2 text-lg font-mono transition-colors hover:text-retro-primary',
      isActive ? 'text-retro-primary' : 'text-retro-accent/80'
    );
  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-retro-primary/30 bg-retro-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Radio className="w-8 h-8 text-retro-primary animate-pulse" />
          <span className="font-pixel text-2xl text-retro-accent">popfm.ru</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={navLinkClass}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-retro-accent" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-retro-background border-l-2 border-retro-primary/50 w-[250px]">
              <div className="p-4">
                <Link to="/" className="flex items-center gap-3 mb-8">
                  <Radio className="w-8 h-8 text-retro-primary" />
                  <span className="font-pixel text-2xl text-retro-accent">popfm.ru</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <NavLink key={item.href} to={item.href} className={navLinkClass}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}