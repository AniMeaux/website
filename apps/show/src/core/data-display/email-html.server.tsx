import tailwindConfig, { fonts } from "#../tailwind.config";
import { createImageUrl } from "#core/data-display/image";
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
  Root: function EmailRoot({ children }: React.PropsWithChildren<{}>) {
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
                  className="m-0 mb-4"
                />
              </Link>

              {children}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  },

  Title: function EmailTitle(props: React.PropsWithChildren<{}>) {
    return (
      <Heading
        {...props}
        as="h1"
        className="m-0 mb-4 text-mystic text-title-large"
      />
    );
  },

  Separator: function EmailSeparator() {
    return (
      <Hr
        // Reset Hr default styles to avoid conflicts.
        style={{ border: undefined, borderTop: undefined }}
        className="m-0 mb-4 border-0 border-t border-solid border-alabaster"
      />
    );
  },

  Paragraph: function EmailParagraph(props: React.PropsWithChildren<{}>) {
    return <Text {...props} className="m-0 mb-4 text-body-lowercase-default" />;
  },

  Link: function EmailLink({
    children,
    ...props
  }: React.PropsWithChildren<{ href: string }>) {
    return (
      <Link
        {...props}
        className="border-0 border-b border-solid border-mystic text-prussianBlue text-body-lowercase-emphasis"
      >
        {/* Use strong because the font weight is not well rendered */}
        <strong>{children}</strong>
      </Link>
    );
  },

  Button: function EmailButton({
    children,
    ...props
  }: React.PropsWithChildren<{ href: string }>) {
    return (
      <Button
        {...props}
        className="rounded-0.5 bg-mystic px-2 py-0.5 text-white text-body-lowercase-emphasis"
      >
        {/* Use strong because the font weight is not well rendered */}
        <strong>{children}</strong>
      </Button>
    );
  },

  Footer: function EmailFooter(props: React.PropsWithChildren<{}>) {
    return <Text {...props} className="text-caption-lowercase-default" />;
  },

  Section: {
    Root: function EmailSectionRoot({ ...props }: React.PropsWithChildren<{}>) {
      return <Section {...props} className="mb-4"></Section>;
    },

    Title: function EmailSectionTitle(props: React.PropsWithChildren<{}>) {
      return (
        <Heading
          {...props}
          as="h2"
          className="m-0 mb-2 text-mystic text-title-item"
        />
      );
    },
  },

  Output: {
    Table: function OutputTable({ children }: React.PropsWithChildren<{}>) {
      const childrenElements = Children.toArray(children).filter(
        (
          child,
        ): child is React.ReactElement<
          React.ComponentPropsWithoutRef<typeof EmailHtml.Output.Row>
        > => isValidElement(child),
      );

      return (
        <table
          align="center"
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          className="w-full border-none"
        >
          <tbody className="w-full">
            {childrenElements.map((child, index) =>
              cloneElement(child, {
                _isLast: index === childrenElements.length - 1,
              }),
            )}
          </tbody>
        </table>
      );
    },

    Row: function OutputRow({
      children,
      _isLast,
    }: React.PropsWithChildren<{ _isLast?: boolean }>) {
      const childrenElements = Children.toArray(children).filter(
        (
          child,
        ): child is React.ReactElement<
          | React.ComponentPropsWithoutRef<typeof EmailHtml.Output.Label>
          | React.ComponentPropsWithoutRef<typeof EmailHtml.Output.Value>
        > => isValidElement(child),
      );

      return (
        <tr className="w-full">
          {childrenElements.map((child) =>
            cloneElement(child, { _isLastRow: _isLast }),
          )}
        </tr>
      );
    },

    Label: function OutputLabel({
      _isLastRow,
      children,
    }: React.PropsWithChildren<{ _isLastRow?: boolean }>) {
      return (
        <Column
          className={cn(
            "w-1/2 pr-2 align-top text-caption-lowercase-default",
            _isLastRow ? undefined : "pb-1",
          )}
        >
          {children}
        </Column>
      );
    },

    Value: function OutputValue({
      _isLastRow,
      children,
    }: React.PropsWithChildren<{ _isLastRow?: boolean }>) {
      return (
        <Column
          className={cn(
            "w-1/2 align-top text-body-lowercase-default",
            _isLastRow ? undefined : "pb-1",
          )}
        >
          {children}
        </Column>
      );
    },
  },
};

/**
 * Not exported from @react-email/components Font.
 */
type FallbackFont = KeepString<
  React.ComponentProps<typeof Font>["fallbackFontFamily"]
>;

type KeepString<T> = T extends string ? T : never;
