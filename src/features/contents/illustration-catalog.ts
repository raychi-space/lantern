export const illustrationSubjects = [
  {
    id: 'sea',
    name: '海岸',
    title: '海岸的潮水',
    body: '远处的岛与沙滩。',
    words: /海|潮|岛|沙滩|\b(sea|ocean|coast)\b/gi,
  },
  {
    id: 'harbor',
    name: '海港',
    title: '停在海港的小船',
    body: '码头与帆船。',
    words: /海港|港口|码头|帆船|\b(harbor|port|boat)\b/gi,
  },
  {
    id: 'lighthouse',
    name: '灯塔',
    title: '远处的灯塔',
    body: '灯塔照看着礁石。',
    words: /灯塔|礁石|\blighthouse\b/gi,
  },
  {
    id: 'mountains',
    name: '山谷',
    title: '山谷的远方',
    body: '群山之间的溪流。',
    words: /山|山谷|群山|溪流|\b(mountain|valley)\b/gi,
  },
  {
    id: 'forest',
    name: '森林',
    title: '森林里的小径',
    body: '杉树与森林。',
    words: /森林|杉树|树林|\b(forest|woods)\b/gi,
  },
  {
    id: 'garden',
    name: '花园',
    title: '花园与植物',
    body: '花与叶子缓慢生长。',
    words: /花|花园|植物|叶|\b(garden|flower)\b/gi,
  },
  {
    id: 'city',
    name: '街区',
    title: '城市的街区',
    body: '街道与矮房子。',
    words: /城市|街|街道|\b(city|street)\b/gi,
  },
  {
    id: 'skyscrapers',
    name: '高楼之间',
    title: '在高楼之间',
    body: '摩天楼与高楼围合的空间。',
    words: /高楼|摩天|大厦|写字楼|\b(skyscraper|tower)\b/gi,
  },
  {
    id: 'rooftops',
    name: '屋顶',
    title: '屋顶上的风',
    body: '天台与屋顶的烟囱。',
    words: /屋顶|天台|烟囱|\brooftop\b/gi,
  },
  {
    id: 'station',
    name: '车站',
    title: '安静的车站',
    body: '列车停靠在站台。',
    words: /车站|列车|站台|火车|地铁|\b(station|train)\b/gi,
  },
  {
    id: 'bridge',
    name: '桥梁',
    title: '桥梁的一端',
    body: '桥下是河流。',
    words: /桥|河流|\b(bridge|river)\b/gi,
  },
  {
    id: 'alley',
    name: '小巷',
    title: '走进小巷',
    body: '巷子里的门与窗。',
    words: /小巷|巷|胡同|\balley\b/gi,
  },
  {
    id: 'room',
    name: '窗边',
    title: '窗边的咖啡',
    body: '窗台与房间的光。',
    words: /窗|房间|工作|代码|编程|技术|咖啡|\b(room|window|code|coffee)\b/gi,
  },
  {
    id: 'books',
    name: '书与信',
    title: '书与一封信',
    body: '书页、阅读和写作。',
    words: /书|阅读|写作|信|\b(book|read|letter)\b/gi,
  },
  {
    id: 'still-life',
    name: '器物静物',
    title: '桌上的花瓶与果实',
    body: '杯子、陶器与梨。',
    words: /花瓶|果实|杯子|陶器|梨|静物|\b(vase|ceramic|still.life)\b/gi,
  },
  {
    id: 'greenhouse',
    name: '温室',
    title: '玻璃温室',
    body: '温室里有蕨类。',
    words: /温室|蕨|\b(greenhouse|fern)\b/gi,
  },
  {
    id: 'desert',
    name: '沙丘',
    title: '沙丘与旷野',
    body: '沙漠与旷野的沙丘。',
    words: /沙丘|沙漠|旷野|\b(desert|dune)\b/gi,
  },
  {
    id: 'abstract',
    name: '梦境意象',
    title: '悬浮的几何',
    body: '漂浮的门与抽象形状。',
    words: /悬浮|漂浮|抽象|几何|超现实|\b(abstract|surreal|geometry)\b/gi,
  },
] as const

export const illustrationWeathers = [
  { id: 'clear', name: '晴天', words: /晴|阳光|\b(sunny|clear)\b/gi },
  { id: 'cloudy', name: '阴天', words: /阴天|乌云|多云|\b(cloudy|overcast)\b/gi },
  { id: 'rain', name: '雨天', words: /雨|下雨|\b(rain|rainy)\b/gi },
  { id: 'snow', name: '雪天', words: /雪|下雪|\b(snow|snowy)\b/gi },
  { id: 'fog', name: '雾天', words: /雾|薄雾|\b(fog|mist)\b/gi },
  { id: 'wind', name: '有风', words: /风|\b(wind|windy)\b/gi },
] as const

export const illustrationTimes = [
  { id: 'day', name: '白天', words: /白天|午后|清晨|\b(day|morning)\b/gi },
  { id: 'sunset', name: '黄昏', words: /黄昏|日落|傍晚|\b(sunset|dusk)\b/gi },
  { id: 'night', name: '夜晚', words: /夜|月|星|梦|睡|\b(night|moon|star|dream)\b/gi },
] as const

export type IllustrationSubject = (typeof illustrationSubjects)[number]['id']
export type IllustrationWeather = (typeof illustrationWeathers)[number]['id']
export type IllustrationTime = (typeof illustrationTimes)[number]['id']
export type IllustrationOptions = {
  subject?: IllustrationSubject
  weather?: IllustrationWeather
  time?: IllustrationTime
}
