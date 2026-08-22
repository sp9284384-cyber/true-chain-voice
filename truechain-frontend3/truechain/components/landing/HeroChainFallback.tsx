/**
 * Static fallback for the 3D chain — shown by the Suspense boundary while
 * the WebGL scene loads, so the hero never shows a blank box. Pure CSS,
 * same visual idea (linked glowing nodes) as the real scene.
 */
export function HeroChainFallback() {
  const nodes = Array.from({ length: 7 });
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="flex items-center">
        {nodes.map((_, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && <div className="h-px w-8 bg-gradient-to-r from-trust/60 to-trust/10 sm:w-10" />}
            <div
              className="h-8 w-8 shrink-0 rounded-md border border-trust/50 bg-trust/10 shadow-glow sm:h-10 sm:w-10"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
