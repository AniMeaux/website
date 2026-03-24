// Add a custom CSS variables here.
// https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
declare module "@types/react" {
  interface CSSProperties {
    "--header-height"?: `${number}px`
  }
}

// Files containing module augmentation must be modules (as opposed to scripts).
// The difference between modules and scripts is that modules have at least one
// import/export statement.
export {}
