import tailwindConfig, { fonts } from "#../tailwind.config";
import { createImageUrl } from "#core/data-display/image";
import type { MarkdownComponents } from "#core/data-display/markdown";
import {
  Markdown,
  PARAGRAPH_COMPONENTS,
  SENTENCE_COMPONENTS,
  withoutNode,
} from "#core/data-display/markdown";
import { cn } from "@animeaux/core";
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Children, cloneElement, isValidElement } from "react";

export const EmailHtml = {
  Root: function EmailHtmlRoot({ children }: React.PropsWithChildren<{}>) {
    const fontElements = (Object.keys(fonts) as (keyof typeof fonts)[]).flatMap(
      (type) => {
        const fontFamily = fonts[type];

        return fontFamily.variants.map((variant) => (
          <Font
            key={variant.url}
            fontFamily={fontFamily.family}
            fallbackFontFamily={fontFamily.fallback as FallbackFont}
            webFont={{
              url: `${process.env.PUBLIC_HOST}${variant.url}`,
              format: variant.format,
            }}
            fontWeight={variant.weight}
            fontStyle={variant.style}
          />
        ));
      },
    );

    return (
      <Html lang="fr-FR">
        <Tailwind config={tailwindConfig}>
          <Head>{fontElements}</Head>

          <Body className="m-0 break-words bg-white p-0 py-4 text-prussianBlue">
            <Container className="mx-auto max-w-screen-sm px-[16px]">
              <Link href={process.env.PUBLIC_HOST}>
                <Img
                  src={createImageUrl(
                    process.env.CLOUDINARY_CLOUD_NAME,
                    "show/logos/flat-medium-light_aoea56",
                  )}
                  width="72"
                  height="72"
                  alt="Salon des Ani’Meaux"
                  className="m-0"
                />
              </Link>

              {children}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  },

  Title: function EmailHtmlTitle(props: React.PropsWithChildren<{}>) {
    return (
      <Heading
        {...props}
        as="h1"
        className="m-0 mt-4 text-mystic text-title-large"
      />
    );
  },

  SectionSeparator: function EmailHtmlSectionSeparator() {
    return (
      <Hr
        // Reset Hr default styles to avoid conflicts.
        style={{ border: undefined, borderTop: undefined }}
        className="m-0 mt-4 border-0 border-t border-solid border-alabaster"
      />
    );
  },

  Footer: function EmailHtmlFooter(props: React.PropsWithChildren<{}>) {
    return (
      <EmailHtml.Section.Root>
        <Text {...props} className="m-0 text-caption-lowercase-default" />
      </EmailHtml.Section.Root>
    );
  },

  Paragraph: function EmailHtmlParagraph({
    _isFirst,
    ...props
  }: React.PropsWithChildren<IsFirstProps>) {
    return (
      <Text
        {...props}
        className={cn(
          "m-0 text-body-lowercase-default",
          _isFirst ? undefined : "mt-2",
        )}
      />
    );
  },

  Strong,

  Markdown,

  Link: function EmailHtmlLink({
    children,
    ...props
  }: React.PropsWithChildren<{ href: string }>) {
    return (
      <Link
        {...props}
        className="border-0 border-b border-solid border-mystic text-prussianBlue"
      >
        <EmailHtml.Strong>{children}</EmailHtml.Strong>
      </Link>
    );
  },

  Button: function EmailHtmlButton({
    children,
    ...props
  }: React.PropsWithChildren<{ href: string }>) {
    return (
      <Button
        {...props}
        className="rounded-0.5 bg-mystic px-2 py-0.5 text-white"
      >
        <EmailHtml.Strong>{children}</EmailHtml.Strong>
      </Button>
    );
  },

  UnorderedList: function EmailHtmlUnorderedList({
    _isFirst,
    ...props
  }: React.PropsWithChildren<IsFirstProps>) {
    return (
      <ul
        {...props}
        className={cn(
          "m-0 pl-[16px] text-body-lowercase-default",
          _isFirst ? undefined : "mt-2",
        )}
      />
    );
  },

  Section: {
    Root: function EmailHtmlSectionRoot({
      children,
    }: React.PropsWithChildren<{}>) {
      const childrenElements = Children.toArray(children).filter(
        (child): child is React.ReactElement<IsFirstProps> =>
          isValidElement(child),
      );

      return (
        <Section className="mt-4">
          {childrenElements.map((child, index) =>
            cloneElement(child, { _isFirst: index === 0 }),
          )}
        </Section>
      );
    },

    Title: function EmailHtmlSectionTitle(props: React.PropsWithChildren<{}>) {
      return (
        <Heading
          {...props}
          as="h2"
          className="m-0 text-mystic text-title-item"
        />
      );
    },
  },

  Output: {
    Table: function EmailHtmlOutputTable({
      _isFirst,
      children,
    }: React.PropsWithChildren<IsFirstProps>) {
      const childrenElements = Children.toArray(children).filter(
        (child): child is React.ReactElement<IsFirstProps> =>
          isValidElement(child),
      );

      return (
        <table
          align="center"
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          className={cn(
            "m-0 w-full border-none",
            _isFirst ? undefined : "mt-2",
          )}
        >
          <tbody className="w-full">
            {childrenElements.map((child, index) =>
              cloneElement(child, { _isFirst: index === 0 }),
            )}
          </tbody>
        </table>
      );
    },

    RowSeparator: function EmailHtmlOutputRowSeparator() {
      return (
        <tr className="w-full">
          <Column className="pt-1">
            <Hr
              // Reset Hr default styles to avoid conflicts.
              style={{ border: undefined, borderTop: undefined }}
              className="m-0 border-0 border-t border-dashed border-alabaster"
            />
          </Column>

          <Column className="pt-1">
            <Hr
              // Reset Hr default styles to avoid conflicts.
              style={{ border: undefined, borderTop: undefined }}
              className="m-0 border-0 border-t border-dashed border-alabaster"
            />
          </Column>
        </tr>
      );
    },

    Row: function EmailHtmlOutputRow({
      _isFirst,
      children,
    }: React.PropsWithChildren<IsFirstProps>) {
      const childrenElements = Children.toArray(children).filter(
        (child): child is React.ReactElement<IsFirstProps> =>
          isValidElement(child),
      );

      return (
        <tr className="w-full">
          {childrenElements.map((child) => cloneElement(child, { _isFirst }))}
        </tr>
      );
    },

    Label: function EmailHtmlOutputLabel({
      _isFirst: _isFirstRow,
      children,
    }: React.PropsWithChildren<IsFirstProps>) {
      return (
        <Column
          className={cn(
            "w-1/2 pr-2 align-top text-caption-lowercase-default",
            _isFirstRow ? undefined : "pt-1",
          )}
        >
          {children}
        </Column>
      );
    },

    Value: function EmailHtmlOutputValue({
      _isFirst: _isFirstRow,
      children,
    }: React.PropsWithChildren<IsFirstProps>) {
      return (
        <Column
          className={cn(
            "w-1/2 align-top text-body-lowercase-emphasis",
            _isFirstRow ? undefined : "pt-1",
          )}
        >
          <EmailHtml.Strong>{children}</EmailHtml.Strong>
        </Column>
      );
    },
  },
};

export type IsFirstProps = { _isFirst?: boolean };

/**
 * Not exported from @react-email/components Font.
 */
type FallbackFont = KeepString<
  React.ComponentProps<typeof Font>["fallbackFontFamily"]
>;

type KeepString<T> = T extends string ? T : never;

function Strong(props: React.PropsWithChildren<{}>) {
  // Wrap in a span with the class because the font weight is not well
  // rendered.
  return (
    <span className="text-body-lowercase-emphasis">
      <strong {...withoutNode(props)} />
    </span>
  );
}

export const EMAIL_SENTENCE_COMPONENTS: MarkdownComponents = {
  ...SENTENCE_COMPONENTS,

  strong: Strong,

  a: ({ children, href }) => {
    if (href == null) {
      return <span>children</span>;
    }

    return <EmailHtml.Link href={href}>{children}</EmailHtml.Link>;
  },
};

export const EMAIL_PARAGRAPH_COMPONENTS: MarkdownComponents = {
  ...PARAGRAPH_COMPONENTS,
  ...EMAIL_SENTENCE_COMPONENTS,

  p: (props) => <EmailHtml.Paragraph {...withoutNode(props)} />,

  ul: (props) => (
    <ul {...withoutNode(props)} className="m-0 mt-2 list-disc p-0 pl-[16px]" />
  ),

  ol: (props) => (
    <ol
      {...withoutNode(props)}
      className="m-0 mt-2 list-decimal p-0 pl-[16px]"
    />
  ),

  li: (props) => (
    <li {...withoutNode(props)} className="m-0 text-body-lowercase-default" />
  ),
};
