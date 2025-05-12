export const CLOTHING_TYPES = [
  'top',
  'bottom',
  'shorts',
  'dress',
  'outerwear',
  'shoes',
  'accessory'
] as const;

export const STYLE_TYPES = [
  'casual',
  'formal',
  'smart-casual',
  'sporty'
] as const;

export const SEASON_TYPES = [
  'summer',
  'winter',
  'spring-fall',
  'all'
] as const;

export const COLORS = [
  'red',
  'dark red',
  'pink',
  'orange',
  'yellow',
  'green',
  'olive',
  'blue',
  'navy',
  'purple',
  'brown',
  'khaki',
  'beige',
  'black',
  'gray',
  'white'
] as const;

export type ClothingType = typeof CLOTHING_TYPES[number];
export type StyleType = typeof STYLE_TYPES[number];
export type SeasonType = typeof SEASON_TYPES[number];
export type ColorType = typeof COLORS[number]; 