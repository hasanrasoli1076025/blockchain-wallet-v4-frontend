import Theme from '@components/Colors/Default'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'styled-components'

declare module 'styled-components' {
  type ITheme = typeof Theme
  // eslint-disable-next-line
  export interface DefaultTheme extends ITheme {}
}
