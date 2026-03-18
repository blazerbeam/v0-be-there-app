import { Logo, LogoIcon } from "@/components/logo"

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-16">
        <h1 className="font-serif text-4xl text-foreground">BeThere Logo</h1>
        
        {/* Icon Only - Green */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-foreground">Icon Only - Green (Primary)</h2>
          <div className="flex items-end gap-8 p-8 bg-card rounded-2xl border">
            <div className="text-center space-y-2">
              <LogoIcon variant="green" size={24} />
              <p className="text-xs text-muted-foreground">24px</p>
            </div>
            <div className="text-center space-y-2">
              <LogoIcon variant="green" size={32} />
              <p className="text-xs text-muted-foreground">32px</p>
            </div>
            <div className="text-center space-y-2">
              <LogoIcon variant="green" size={48} />
              <p className="text-xs text-muted-foreground">48px</p>
            </div>
            <div className="text-center space-y-2">
              <LogoIcon variant="green" size={64} />
              <p className="text-xs text-muted-foreground">64px</p>
            </div>
            <div className="text-center space-y-2">
              <LogoIcon variant="green" size={96} />
              <p className="text-xs text-muted-foreground">96px</p>
            </div>
          </div>
        </section>

        {/* Icon Only - Mono */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-foreground">Icon Only - Monochrome</h2>
          <div className="flex items-end gap-8 p-8 bg-card rounded-2xl border">
            <div className="text-center space-y-2">
              <LogoIcon variant="mono" size={24} />
              <p className="text-xs text-muted-foreground">24px</p>
            </div>
            <div className="text-center space-y-2">
              <LogoIcon variant="mono" size={32} />
              <p className="text-xs text-muted-foreground">32px</p>
            </div>
            <div className="text-center space-y-2">
              <LogoIcon variant="mono" size={48} />
              <p className="text-xs text-muted-foreground">48px</p>
            </div>
            <div className="text-center space-y-2">
              <LogoIcon variant="mono" size={64} />
              <p className="text-xs text-muted-foreground">64px</p>
            </div>
            <div className="text-center space-y-2">
              <LogoIcon variant="mono" size={96} />
              <p className="text-xs text-muted-foreground">96px</p>
            </div>
          </div>
        </section>

        {/* Logo with Text - Green */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-foreground">Logo with Text - Green</h2>
          <div className="flex flex-col gap-6 p-8 bg-card rounded-2xl border">
            <Logo variant="green" showText size="sm" />
            <Logo variant="green" showText size="md" />
            <Logo variant="green" showText size="lg" />
          </div>
        </section>

        {/* Logo with Text - Mono */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-foreground">Logo with Text - Monochrome</h2>
          <div className="flex flex-col gap-6 p-8 bg-card rounded-2xl border">
            <Logo variant="mono" showText size="sm" />
            <Logo variant="mono" showText size="md" />
            <Logo variant="mono" showText size="lg" />
          </div>
        </section>

        {/* On Dark Background */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-foreground">On Dark Background</h2>
          <div className="flex items-center gap-8 p-8 bg-foreground rounded-2xl">
            <LogoIcon variant="green" size={48} />
            <div className="flex items-center gap-2">
              <LogoIcon variant="green" size={32} />
              <span className="font-sans font-semibold text-xl text-background">BeThere</span>
            </div>
          </div>
        </section>

        {/* Header Example */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-foreground">Header Usage Example</h2>
          <div className="p-6 bg-card rounded-2xl border flex items-center justify-between">
            <Logo variant="green" showText size="md" />
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>About</span>
              <span>Contact</span>
            </nav>
          </div>
        </section>

        {/* Favicon Preview */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-foreground">Favicon Preview</h2>
          <div className="flex items-center gap-8 p-8 bg-card rounded-2xl border">
            <div className="text-center space-y-2">
              <div className="w-4 h-4 bg-muted rounded overflow-hidden flex items-center justify-center">
                <LogoIcon variant="green" size={16} />
              </div>
              <p className="text-xs text-muted-foreground">16x16</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-muted rounded overflow-hidden flex items-center justify-center">
                <LogoIcon variant="green" size={32} />
              </div>
              <p className="text-xs text-muted-foreground">32x32</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <LogoIcon variant="green" size={48} />
              </div>
              <p className="text-xs text-muted-foreground">48x48</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
