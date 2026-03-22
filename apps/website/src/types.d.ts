import "@total-typescript/ts-reset"

// Add a custom CSS variables here.
// https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
declare module "@types/react" {
  interface CSSProperties {
    "--header-height"?: `${number}px`
  }
}
