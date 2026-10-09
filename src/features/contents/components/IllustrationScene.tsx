import type { contentIllustration } from '../content-illustration'

type Scene = ReturnType<typeof contentIllustration>

function Sky({ scene: s }: { scene: Scene }) {
  const p = s.palette
  const dark = s.time === 'night'
  const sky = dark ? p.ink : s.time === 'sunset' ? '#d6c3a6' : s.weather === 'clear' ? p.sky : p.far
  return (
    <>
      <rect width="640" height="360" fill={sky} />
      {s.clouds.map((cloud, index) => (
        <path
          key={index}
          d={`M${cloud.x} ${cloud.y}q${cloud.width * 0.2} ${-cloud.height} ${cloud.width * 0.4} -3q${cloud.width * 0.3} ${-cloud.height} ${cloud.width * 0.6} 5q${-cloud.width * 0.4} ${cloud.height} ${-cloud.width} -2Z`}
          fill={dark ? p.near : p.paper}
          opacity={s.weather === 'cloudy' || s.weather === 'rain' ? '.55' : '.65'}
        />
      ))}
      {!['rain', 'snow', 'fog', 'cloudy'].includes(s.weather) && (
        <>
          <circle
            cx={s.sun.x}
            cy={s.sun.y + (s.time === 'sunset' ? 72 : 0)}
            r={s.sun.r}
            fill={p.sun}
          />
          {dark && <circle cx={s.sun.x + 11} cy={s.sun.y - 7} r={s.sun.r - 1} fill={sky} />}
        </>
      )}
      {dark &&
        s.weather !== 'fog' &&
        s.weather !== 'rain' &&
        s.stars.map((star, index) => (
          <circle key={index} cx={star.x} cy={star.y} r={star.r} fill={p.paper} opacity=".65" />
        ))}
    </>
  )
}

function Weather({ scene: s }: { scene: Scene }) {
  const p = s.palette
  return (
    <g data-weather-layer={s.weather}>
      {s.weather === 'rain' &&
        s.weatherMarks.map((mark, index) => (
          <path
            key={index}
            d={`M${mark.x} ${mark.y}l-5 15h2l5 -15Z`}
            fill={p.paper}
            opacity=".35"
          />
        ))}
      {s.weather === 'snow' && (
        <>
          <path d="M0 340Q120 325 280 342T640 337V360H0Z" fill={p.paper} opacity=".8" />
          {s.weatherMarks.map((mark, index) => (
            <circle
              key={index}
              cx={mark.x}
              cy={mark.y}
              r={mark.size * 0.65}
              fill={p.paper}
              opacity=".8"
            />
          ))}
        </>
      )}
      {s.weather === 'fog' &&
        [135, 210, 280].map((y, index) => (
          <path
            key={y}
            d={`M0 ${y}Q170 ${y - 15} 350 ${y + 3}T640 ${y - 4}V${y + 35}Q320 ${y + 23} 0 ${y + 33}Z`}
            fill={p.paper}
            opacity={0.2 + index * 0.1}
          />
        ))}
      {s.weather === 'wind' &&
        s.weatherMarks
          .slice(0, 12)
          .map((mark, index) => (
            <path
              key={index}
              d={`M${mark.x} ${mark.y}q20 -8 45 -2l-4 2q-26 -5 -41 2Z`}
              fill={p.paper}
              opacity=".45"
            />
          ))}
    </g>
  )
}

function Plants({ scene: s, flowers = false }: { scene: Scene; flowers?: boolean }) {
  return (
    <>
      {s.plants.map((plant, index) => (
        <g
          key={index}
          transform={`translate(${plant.x} 334)`}
          fill={index % 2 ? s.palette.near : s.palette.ink}
        >
          <path
            d={`M-2 0L${plant.lean - 2 + (s.weather === 'wind' ? 12 : 0)} ${-plant.height}L${plant.lean + 2} ${-plant.height + 4}L2 0Z`}
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
          {flowers && (
            <g fill={s.palette.sun}>
              <circle cx={plant.lean} cy={-plant.height} r={index % 2 ? 6 : 9} />
              <circle cx={plant.lean + 6} cy={-plant.height + 2} r="4" />
            </g>
          )}
        </g>
      ))}
    </>
  )
}

function Hills({ scene: s, sharp = false }: { scene: Scene; sharp?: boolean }) {
  const p = s.palette
  return (
    <>
      <path
        d={
          sharp
            ? `M0 254L105 115L197 197L${s.peak.x} 68L478 194L561 114L640 242V360H0Z`
            : `M0 ${s.horizon + 15}Q110 ${s.horizon - 60} 230 ${s.horizon - 10}Q${s.peak.x} ${s.peak.y} 480 ${s.horizon - 7}Q560 ${s.horizon - 25} 640 ${s.horizon + 5}V360H0Z`
        }
        fill={p.far}
      />
      {sharp && (
        <path
          d={`M${s.peak.x - 33} 111L${s.peak.x} 68L${s.peak.x + 52} 114L${s.peak.x + 15} 104L${s.peak.x + 2} 124L${s.peak.x - 12} 108Z`}
          fill={p.paper}
        />
      )}
      <path
        d={`M0 ${s.horizon + 48}Q150 ${s.horizon + 1} 300 ${s.horizon + 40}T640 ${s.horizon + 30}V360H0Z`}
        fill={p.near}
      />
    </>
  )
}

function Buildings({ scene: s, tall = false }: { scene: Scene; tall?: boolean }) {
  const p = s.palette
  return (
    <>
      {s.buildings.map((building, index) => {
        const top = 302 - building.height * (tall ? 1.5 : 0.65)
        return (
          <g key={index}>
            <path
              d={
                tall
                  ? `M${building.x} 316V${top}L${building.x + building.width} ${top + building.tilt}V316Z`
                  : `M${building.x} 316V${top}l${building.width / 2} -18l${building.width / 2} 18V316Z`
              }
              fill={index % 2 ? p.near : p.ink}
            />
            {Array.from({ length: tall ? 5 : 2 }, (_, row) => (
              <g key={row}>
                {[12, 31].map((x, column) => (
                  <rect
                    key={x}
                    x={building.x + x}
                    y={top + 17 + row * 21}
                    width="8"
                    height="10"
                    fill={building.lit && (row + column + index) % 3 === 0 ? p.sun : p.sky}
                    opacity=".65"
                  />
                ))}
              </g>
            ))}
            {s.weather === 'snow' && (
              <path
                d={`M${building.x} ${top}l${building.width} ${building.tilt}v5l${-building.width} ${-building.tilt}Z`}
                fill={p.paper}
              />
            )}
          </g>
        )
      })}
    </>
  )
}

function Subject({ scene: s, windowId }: { scene: Scene; windowId: string }) {
  const p = s.palette
  const water = (
    <>
      <path d="M0 207Q190 196 380 213T640 207V360H0Z" fill={p.near} />
      {[232, 262, 307].map((y, i) => (
        <path
          key={y}
          d={`M${70 + i * 95} ${y}q120 -5 270 1l-45 3l-100 -1Z`}
          fill={p.paper}
          opacity=".4"
        />
      ))}
    </>
  )
  const desk = <path d="M0 288L640 279V360H0Z" fill={p.near} />
  switch (s.theme) {
    case 'sea':
      return (
        <>
          <Hills scene={s} />
          {water}
          <path d="M0 300Q130 268 221 310L270 360H0Z" fill={p.paper} />
          <path d={`M${s.objectX} 290l25 -23l34 19l-7 13Z`} fill={p.ink} />
        </>
      )
    case 'harbor':
      return (
        <>
          <Buildings scene={s} />
          {water}
          <path d="M0 304L640 296V320L0 329Z" fill={p.ink} />
          {[90, 210, 460].map((x, i) => (
            <g key={x} transform={`translate(${x} ${232 + i * 8})`}>
              <path d="M-38 0H60L42 24H-19Z" fill={p.paper} />
              <path d="M9 -90L12 -4H8Z" fill={p.ink} />
              <path d="M6 -85L-33 -8H5Z" fill={p.sky} />
              <path d="M15 -71L48 -12H15Z" fill={p.sun} opacity=".7" />
            </g>
          ))}
        </>
      )
    case 'lighthouse':
      return (
        <>
          {water}
          <path d="M0 315L174 281L361 302L640 279V360H0Z" fill={p.ink} />
          <g transform={`translate(${s.objectX} 275)`}>
            <path d="M-31 0L-20 -140H20L32 0Z" fill={p.paper} />
            <path d="M-24 -93H24L27 -66H-27ZM-29 -38H29L31 -15H-31Z" fill={p.near} />
            <path d="M-23 -142V-168H23V-142Z" fill={p.ink} />
            <path d="M-32 -168L0 -192L32 -168Z" fill={p.ink} />
            <path d="M-12 -162H12V-147H-12Z" fill={p.sun} />
          </g>
        </>
      )
    case 'mountains':
      return (
        <>
          <Hills scene={s} sharp />
          <path
            d="M340 250Q257 290 318 315L259 360H428Q417 318 350 292L361 251Z"
            fill={p.paper}
            opacity=".7"
          />
          <path d="M60 320l23 -34l38 23l-5 21Z" fill={p.ink} />
        </>
      )
    case 'forest':
      return (
        <>
          <Hills scene={s} />
          {s.buildings.map((tree, i) => (
            <g key={i} transform={`translate(${tree.x + 25} 326)`}>
              <path d={`M-5 0V${-tree.height}H5V0Z`} fill={p.ink} />
              <path
                d={`M-38 -25L0 ${-tree.height - 80}L39 -25L18 -28L43 -6H-42L-20 -30Z`}
                fill={i % 2 ? p.ink : p.far}
              />
            </g>
          ))}
          <path d="M296 290L245 360H366L322 290Z" fill={p.paper} opacity=".6" />
        </>
      )
    case 'garden':
      return (
        <>
          <Hills scene={s} />
          <path d="M0 326Q240 280 640 320V360H0Z" fill={p.paper} />
          <Plants scene={s} flowers />
          <path d="M270 263H384V277H270ZM283 277H291V308H283ZM364 277H372V308H364Z" fill={p.ink} />
        </>
      )
    case 'city':
      return (
        <>
          <path d="M0 245H640V360H0Z" fill={p.far} />
          <Buildings scene={s} />
          <path d="M0 309L640 319V360H0Z" fill={p.near} />
          <path d="M180 335h280l-12 3H198Z" fill={p.paper} opacity=".6" />
        </>
      )
    case 'skyscrapers':
      return (
        <>
          <Buildings scene={s} tall />
          <path d="M300 259L246 360H427L346 259Z" fill={p.paper} opacity=".5" />
          <path d="M0 0L133 38L171 360H0ZM640 0L526 48L487 360H640Z" fill={p.ink} />
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <g key={row} fill={row % 3 ? p.near : p.sun} opacity=".7">
              <path d={`M25 ${45 + row * 43}l75 15l2 18l-77 -13Z`} />
              <path d={`M552 ${59 + row * 41}l63 -16v17l-64 15Z`} />
            </g>
          ))}
        </>
      )
    case 'rooftops':
      return (
        <>
          <Buildings scene={s} />
          <path d="M0 278L250 194L440 270L640 206V360H0Z" fill={p.ink} />
          <path d="M250 194L440 270L640 206L640 360L325 360Z" fill={p.near} />
          <path d={`M${s.objectX} 229v-67h32v77Z`} fill={p.far} />
          <path d={`M${s.objectX - 5} 162h42v8h-42Z`} fill={p.paper} />
          <path d="M92 258L88 183H92L97 254ZM61 193L122 188L123 192L61 197Z" fill={p.sky} />
        </>
      )
    case 'station':
      return (
        <>
          <path d="M0 263H640V360H0Z" fill={p.far} />
          <path d="M0 303L640 290V315L0 330Z" fill={p.ink} />
          <path d="M30 81L581 82L604 102H14Z" fill={p.ink} />
          <path d="M43 100H53V285H43ZM556 100H566V288H556Z" fill={p.near} />
          <path d="M110 183Q111 161 141 161H474Q499 164 505 195V258H110Z" fill={p.paper} />
          {[135, 190, 245, 300, 355, 410].map((x) => (
            <rect key={x} x={x} y="182" width="36" height="36" fill={p.near} />
          ))}
          <path d="M110 239H505V251H110Z" fill={p.sun} />
          <path d="M315 107H369V145H315Z" fill={p.paper} />
          <circle cx="342" cy="126" r="12" fill={p.ink} />
          <path d="M341 117H344V126L351 130L350 132L341 128Z" fill={p.paper} />
        </>
      )
    case 'bridge':
      return (
        <>
          {water}
          <path
            d="M0 205Q170 128 320 166Q497 116 640 171V203Q462 151 324 191Q156 153 0 230Z"
            fill={p.ink}
          />
          <path d="M123 184H146V312H123ZM471 171H494V310H471Z" fill={p.ink} />
          <path
            d="M0 203Q173 133 320 172Q500 122 640 177V182Q500 128 320 177Q173 139 0 209Z"
            fill={p.paper}
          />
          <path d="M0 336Q102 306 186 341L220 360H0Z" fill={p.paper} />
        </>
      )
    case 'alley':
      return (
        <>
          <path d="M0 0L253 85L264 285L0 360Z" fill={p.near} />
          <path d="M640 0L396 87L375 285L640 360Z" fill={p.ink} />
          <path d="M264 285L375 285L527 360H112Z" fill={p.paper} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path d={`M${40 + i * 68} ${110 + i * 18}l39 13v58l-39 -2Z`} fill={p.ink} />
              <path
                d={`M${464 + i * 57} ${125 - i * 14}l30 -8v57l-30 5Z`}
                fill={i % 2 ? p.sun : p.sky}
                opacity=".7"
              />
            </g>
          ))}
          <path d="M155 218L213 226V312L155 327Z" fill={p.paper} />
          <path d="M289 217H348V287H289Z" fill={p.far} />
        </>
      )
    case 'room':
      return (
        <>
          <rect width="640" height="360" fill={p.paper} />
          <g clipPath={`url(#${windowId})`}>
            <Sky scene={s} />
            <Buildings scene={s} tall />
            <Weather scene={s} />
          </g>
          <path
            d="M66 27H87V265H66ZM553 27H575V265H553ZM74 255H568V273H74ZM321 36H332V258H321Z"
            fill={p.near}
          />
          {desk}
          <path d="M190 273H283V280H190ZM205 260H275V273H205Z" fill={p.paper} />
          <path d="M368 242H412V283H374Z" fill={p.ink} />
          <path
            d="M409 249Q434 248 431 265Q430 276 411 271L411 265Q424 267 425 259Q425 255 411 256Z"
            fill={p.ink}
          />
          <Plants scene={s} />
        </>
      )
    case 'books':
      return (
        <>
          <Weather scene={s} />
          {desk}
          <path d="M174 198L287 211L278 241L165 228Z" fill={p.ink} />
          <path d="M169 230L287 242L282 256L164 244Z" fill={p.paper} />
          <path d="M164 248L294 259L288 274L158 262Z" fill={p.sun} />
          <path d={`M${s.objectX} 237l70 -28l62 22l-13 50l-65 -7l-70 3Z`} fill={p.paper} />
          <path d={`M${s.objectX + 68} 216l3 2l-18 49l-3 -1Z`} fill={p.far} />
          <path d="M74 113L182 117L175 173L68 169Z" fill={p.paper} />
          <path d="M74 113L124 148L182 117L125 153Z" fill={p.far} />
        </>
      )
    case 'still-life':
      return (
        <>
          <Weather scene={s} />
          {desk}
          <path
            d={`M${s.objectX - 34} 190q-4 12 -15 27q-26 45 -8 66q55 14 92 -1q14 -22 -12 -65q-11 -13 -10 -27Z`}
            fill={p.ink}
          />
          <path
            d={`M${s.objectX - 22} 191l-9 -97l5 -1l9 98ZM${s.objectX + 1} 191l24 -118l4 1l-24 117Z`}
            fill={p.near}
          />
          <ellipse
            cx={s.objectX - 42}
            cy="137"
            rx="24"
            ry="9"
            fill={p.near}
            transform={`rotate(30 ${s.objectX - 42} 137)`}
          />
          <ellipse
            cx={s.objectX + 28}
            cy="106"
            rx="25"
            ry="10"
            fill={p.near}
            transform={`rotate(-30 ${s.objectX + 28} 106)`}
          />
          <path
            d="M166 254q-19 -16 -24 5q-27 30 -8 43q36 10 58 -3q10 -20 -16 -36q-1 -15 -10 -9Z"
            fill={p.sun}
          />
          <ellipse cx="466" cy="299" rx="51" ry="7" fill={p.paper} />
          <path d="M439 259H482L476 295H445Z" fill={p.paper} />
        </>
      )
    case 'greenhouse':
      return (
        <>
          <Hills scene={s} />
          <path d="M104 177L319 65L536 174V325H104Z" fill={p.sky} opacity=".75" />
          <Plants scene={s} />
          <path
            d="M96 175L318 57L544 174L539 181L319 69L101 183ZM102 175H111V328H102ZM531 176H540V328H531ZM314 66H323V327H314ZM206 123H214V328H206ZM424 122H432V328H424ZM107 214H536V222H107Z"
            fill={p.paper}
          />
          <path d="M276 242H361V327H276Z" fill={p.ink} opacity=".5" />
        </>
      )
    case 'desert':
      return (
        <>
          <path d="M0 219Q173 118 339 209T640 198V360H0Z" fill="#cbbca0" />
          <path d="M0 309Q167 223 390 284T640 262V360H0Z" fill={p.paper} />
          <path d={`M${s.objectX} 272l7 -105l29 8l10 107Z`} fill={p.ink} />
          <path d="M38 296l63 -30l26 21l-36 13Z" fill={p.far} />
        </>
      )
    case 'abstract':
      return (
        <>
          <path d="M0 309Q210 266 640 307V360H0Z" fill={p.paper} />
          <path
            d={`M${s.objectX - 36} 106L${s.objectX + 42} 91V263L${s.objectX - 36} 275Z`}
            fill={p.ink}
          />
          <path
            d={`M${s.objectX - 23} 119L${s.objectX + 24} 111V250L${s.objectX - 23} 259Z`}
            fill={p.paper}
          />
          <circle cx="140" cy="170" r={34 + s.variation * 4} fill={p.sun} />
          <path d="M440 139l43 -31l51 24l-48 32Z" fill={p.paper} />
          <path d="M110 284l28 -28l35 21l-28 25Z" fill={p.near} />
          <path d="M412 290l72 -13l44 9l-72 14Z" fill={p.ink} opacity=".4" />
        </>
      )
  }
}

export function IllustrationScene({ scene, instance }: { scene: Scene; instance: string }) {
  const grain = `article-grain-${instance}-${scene.seed}`
  const frame = `article-window-${instance}-${scene.seed}`
  return (
    <svg
      className="generated-article-cover"
      viewBox="0 0 640 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      data-cover-seed={scene.seed}
      data-cover-scene={scene.theme}
      data-cover-weather={scene.weather}
      data-cover-time={scene.time}
    >
      <defs>
        <filter id={grain} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".65"
            numOctaves="3"
            seed={scene.seed % 10000}
            stitchTiles="stitch"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="paint"
          />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer result="grain">
            <feFuncA type="linear" slope=".2" />
          </feComponentTransfer>
          <feBlend in="paint" in2="grain" mode="multiply" />
        </filter>
        <clipPath id={frame}>
          <path d="M80 35L555 38L553 259L82 257Z" />
        </clipPath>
      </defs>
      <g filter={`url(#${grain})`}>
        <g transform={scene.flipped ? 'translate(640 0) scale(-1 1)' : undefined}>
          <Sky scene={scene} />
          <Subject scene={scene} windowId={frame} />
          {!['room', 'books', 'still-life'].includes(scene.theme) && <Weather scene={scene} />}
        </g>
      </g>
    </svg>
  )
}
