// Allow SVG imports as React components.
declare module "*.svg" {
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default ReactComponent;
}

// Allow Markdown imports as string.
declare module "*.md" {
  const Content: string;
  export default Content;
}

// This package doesn't have typings because we only pass it to react-markdown.
declare module "remark-slug" {
  const pluggin: any;
  export default pluggin;
}
