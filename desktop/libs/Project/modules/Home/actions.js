export const CHANGE_BACKGROUND = 'CHANGE_BACKGROUND'

export const changeBackground = (color) => {
  return {
    type: CHANGE_BACKGROUND,
    color
  }
}