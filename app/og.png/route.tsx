import { ImageResponse } from "next/og";
import { ensoSvg } from "@/lib/enso-svg";
import { profile } from "@/lib/portfolio-data";

// A route handler rather than the opengraph-image convention: static export
// writes that one without a file extension, and GitHub Pages would then serve
// it as application/octet-stream, which social crawlers reject.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

// Washi palette from app/globals.css, as hex for the image renderer.
const PAPER = "#f4f0e7";
const INK = "#241e1a";
const MUTED = "#5b544d";
const GOLD = "#cc9c42";

// Satori needs TTF/OTF, so fetch each family from Google Fonts at build time,
// subset to the characters actually drawn.
async function loadGoogleFont(family: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const source = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!source) throw new Error(`Could not load the ${family} font for the Open Graph image`);
  return (await fetch(source)).arrayBuffer();
}

export async function GET() {
  const [ firstName, ...lastNames ] = profile.name.split(" ");
  const location = profile.location.en.toUpperCase();
  const title = profile.title.en;

  const [ mincho, geist, geistMono ] = await Promise.all([
    loadGoogleFont("Shippori Mincho", profile.name),
    loadGoogleFont("Geist", title),
    loadGoogleFont("Geist Mono", location),
  ]);

  const enso = ensoSvg({
    width: size.width,
    height: size.height,
    cx: 880,
    cy: 315,
    radius: 210,
    ink: INK,
    inkOpacity: 0.88,
    gold: GOLD,
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: PAPER,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
        <img
          src={`data:image/svg+xml;base64,${Buffer.from(enso).toString("base64")}`}
          width={size.width}
          height={size.height}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 80px 96px",
            height: "100%",
          }}
        >
          <div
            style={{
              fontFamily: "Geist Mono",
              fontSize: 18,
              letterSpacing: "0.25em",
              color: MUTED,
            }}
          >
            {location}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              fontFamily: "Shippori Mincho",
              fontSize: 104,
              lineHeight: 1.05,
              color: INK,
            }}
          >
            <span>{firstName}</span>
            <span style={{ paddingLeft: "0.6em" }}>{lastNames.join(" ")}</span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: "Geist",
              fontSize: 30,
              color: MUTED,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Shippori Mincho", data: mincho, weight: 400, style: "normal" },
        { name: "Geist", data: geist, weight: 400, style: "normal" },
        { name: "Geist Mono", data: geistMono, weight: 400, style: "normal" },
      ],
    },
  );
}
