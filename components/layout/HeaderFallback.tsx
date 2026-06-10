export default function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="hidden lg:block border-b border-border/30 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="h-8" />
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 lg:h-16" />
        <div className="hidden lg:block border-t border-border/40">
          <div className="min-h-11" />
        </div>
      </div>
    </header>
  );
}
