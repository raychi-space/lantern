import { contentIllustration } from '../content-illustration'
import type { PublicContent } from '../types'

export function GeneratedArticleCover({ item }: { item: PublicContent }) {
  const scene = contentIllustration(item)
  const { palette: p, sun, peak, horizon, person } = scene
  const night = scene.theme === 'night'
  const grain = `article-grain-${scene.seed}`
  const frame = `article-window-${scene.seed}`
  const landscape = (
    <>
      <rect width="640" height="360" fill={night ? p.ink : p.paper} />
      <path
        d={`M0 0H640V${horizon + 12}Q420 ${horizon - 8} 0 ${horizon}Z`}
        fill={night ? p.ink : p.sky}
      />
      {scene.clouds.map((cloud, index) => (
        <path
          key={index}
          d={`M${cloud.x} ${cloud.y}q${cloud.width * 0.2} ${-cloud.height} ${cloud.width * 0.4} -3q${cloud.width * 0.3} ${-cloud.height} ${cloud.width * 0.6} 5q${-cloud.width * 0.4} ${cloud.height} ${-cloud.width} -2Z`}
          fill={night ? p.near : p.paper}
          opacity=".7"
        />
      ))}
      <circle cx={sun.x} cy={sun.y} r={sun.r} fill={p.sun} />
      {night && <circle cx={sun.x + 11} cy={sun.y - 7} r={sun.r - 1} fill={p.ink} />}
      {night &&
        scene.stars.map((star, index) => (
          <circle
            key={index}
            {...{ cx: star.x, cy: star.y, r: star.r }}
            fill={p.paper}
            opacity=".7"
          />
        ))}
      <path
        d={`M-20 ${horizon + 15}Q110 ${horizon - 60} 230 ${horizon - 10}Q${peak.x} ${peak.y} 480 ${horizon - 7}Q560 ${horizon - 25} 660 ${horizon + 5}V360H-20Z`}
        fill={p.far}
      />
      {scene.theme === 'city' &&
        scene.buildings.map((building, index) => (
          <g key={index}>
            <path
              d={`M${building.x} ${horizon + 30}v${-building.height}l${building.width / 2} -14l${building.width / 2} 14v${building.height}Z`}
              fill={index % 2 ? p.near : p.ink}
            />
            <rect
              x={building.x + 12}
              y={horizon + 44 - building.height}
              width="9"
              height="14"
              fill={p.sun}
              opacity=".7"
            />
          </g>
        ))}
      <path
        d={`M0 ${horizon + 28}Q130 ${horizon + 9} 300 ${horizon + 25}T640 ${horizon + 15}V360H0Z`}
        fill={p.near}
      />
      {scene.theme === 'sea' ? (
        <>
          <path
            d={`M240 ${horizon + 47}q110 -5 280 1l-45 3l-100 -1Z`}
            fill={p.paper}
            opacity=".6"
          />
          <path d={`M300 ${horizon + 73}q100 -4 250 1l-85 3Z`} fill={p.sky} />
        </>
      ) : (
        <path
          d={`M320 ${horizon + 25}q-70 28 -30 53q28 20 -45 82h170q-5 -49 -50 -69q-34 -22 -17 -66Z`}
          fill={p.paper}
          opacity=".6"
        />
      )}
    </>
  )
  return (
    <svg
      className="generated-article-cover"
      viewBox="0 0 640 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      data-cover-seed={scene.seed}
      data-cover-scene={scene.theme}
    >
      <defs>
        <filter id={grain} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".65"
            numOctaves="3"
            seed={scene.seed % 10000}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer result="grain">
            <feFuncA type="linear" slope=".2" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
        </filter>
        <clipPath id={frame}>
          <path d="M80 35L555 38L553 259L82 257Z" />
        </clipPath>
      </defs>
      <g filter={`url(#${grain})`}>
        <g transform={scene.flipped ? 'translate(640 0) scale(-1 1)' : undefined}>
          {scene.theme === 'room' ? (
            <>
              <rect width="640" height="360" fill={p.paper} />
              <g clipPath={`url(#${frame})`}>{landscape}</g>
              <path
                d="M65 24L89 27L88 266L64 270ZM552 28L575 24L578 269L551 265ZM76 253L566 255L573 271L69 269Z"
                fill={p.near}
              />
              <path d="M332 36L342 37L340 255L330 254Z" fill={p.paper} />
              <path d="M0 314L640 303V360H0Z" fill={p.far} />
            </>
          ) : (
            landscape
          )}
          <path d="M0 309Q110 289 227 321T640 316V360H0Z" fill={p.ink} />
          <g transform={`translate(${person.x} ${person.y})`}>
            <path d="M-35 64L-28 8Q-19 -9 4 -1L25 36L57 57L51 68L16 59L-7 36L-9 67Z" fill={p.ink} />
            <path d="M-22 -20Q-24 -41 -6 -43Q16 -42 17 -21L6 -3L-9 -6Z" fill={p.paper} />
            <path d="M-24 -21Q-31 -49 -7 -52Q17 -54 20 -26L12 -21L4 -34L-18 -18Z" fill={p.ink} />
            <path d="M12 25L29 20L44 25L61 21L57 43L40 46L24 39Z" fill={p.paper} />
            <path d="M43 26L45 25L41 43L39 43Z" fill={p.far} />
          </g>
          {scene.plants.map((plant, index) => (
            <g key={index} transform={`translate(${plant.x} 331)`} fill={index % 2 ? p.far : p.ink}>
              <path
                d={`M-2 0L${plant.lean - 2} ${-plant.height}L${plant.lean + 2} ${-plant.height + 4}L2 0Z`}
              />
              {[0.3, 0.55, 0.8].map((position, leaf) => (
                <ellipse
                  key={leaf}
                  cx={plant.lean * position + (leaf % 2 ? 8 : -8)}
                  cy={-plant.height * position}
                  rx="12"
                  ry="5"
                  transform={`rotate(${leaf % 2 ? -30 : 30} ${plant.lean * position} ${-plant.height * position})`}
                />
              ))}
              {scene.theme === 'garden' && (
                <circle cx={plant.lean} cy={-plant.height} r={index % 2 ? 6 : 9} fill={p.sun} />
              )}
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}
