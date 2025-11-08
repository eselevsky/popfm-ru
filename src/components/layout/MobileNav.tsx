import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}
interface MobileNavProps {
  navItems: NavItem[];
}
export function MobileNav({ navItems }: MobileNavProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 px-3 py-2 text-lg font-mono transition-colors hover:text-retro-primary',
      isActive ? 'text-retro-primary' : 'text-retro-accent/80'
    );
  return (
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
  );
}