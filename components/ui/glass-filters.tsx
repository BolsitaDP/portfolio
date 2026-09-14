// Shared SVG filter defs for the CSS-only glass effect (no JS library).
// Rendered once; referenced elsewhere via `filter: url(#glass-grain)` /
// `backdrop-filter: url(#liquid-distortion)`.
export function GlassFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/*
          Refracts whatever sits behind the glass panel. Only Chrome/Chromium
          support SVG references inside backdrop-filter, so this is applied
          as an isolated overlay layer elsewhere — browsers that ignore it
          simply don't render that layer, no fallback needed.
        */}
        <filter
          id="liquid-distortion"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={3} result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale={20}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/*
          Plain `filter: url()` (not backdrop-filter) has broad support, so
          this frosted-glass grain texture renders the same everywhere.
        */}
        <filter id="glass-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
