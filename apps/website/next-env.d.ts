/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;
    NEXT_PUBLIC_APP_BUILD_ID: string;
    NEXT_PUBLIC_APP_SHORT_NAME: string;
    NEXT_PUBLIC_APP_DESCRIPTION: string;
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
  }
}

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
