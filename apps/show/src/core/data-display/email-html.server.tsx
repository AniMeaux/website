import {
  Body,
  Button,
  Column,
  Container,
  Font as FontElement,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components"
import { Children, cloneElement, isValidElement } from "react"
import type { ExtraProps } from "react-markdown"
import type { Except } from "type-fest"

import { createImageUrl } from "#i/core/data-display/image.js"
import type { MarkdownComponents } from "#i/core/data-display/markdown.js"
import {
  Markdown,
  PARAGRAPH_COMPONENTS,
  SENTENCE_COMPONENTS,
  withoutNode,
} from "#i/core/data-display/markdown.js"
import { Color, Font, Spacing } from "#i/generated/theme.js"

// These inline style objects duplicate the `@utility text-*` declarations in
// `text-style.css`. Email clients don't support CSS classes, so styles must be
// inlined. Keep both in sync when changing any text style.
// See: apps/show/src/styles/text-style.css

const TEXT_BODY: React.CSSProperties = {
  fontFamily: '"Fira Sans", Arial',
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  textTransform: "none",
}

const TEXT_BODY_EMPHASIS: React.CSSProperties = {
  ...TEXT_BODY,

  // `font-weight: 500` renders as `normal` in Outlook (no web font support,
  // threshold is ~600)
  fontWeight: 600,
}

const TEXT_CAPTION: React.CSSProperties = {
  fontFamily: '"Fira Sans", Arial',
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "24px",
  textTransform: "none",
}

const TEXT_SECTION_TITLE: React.CSSProperties = {
  fontFamily: '"CARAMEL MOCACINO", Impact',
  fontSize: "52px",
  fontWeight: 400,
  lineHeight: "48px",
  textTransform: "uppercase",
}

const TEXT_ITEM_TITLE: React.CSSProperties = {
  fontFamily: '"CARAMEL MOCACINO", Impact',
  fontSize: "26px",
  fontWeight: 400,
  lineHeight: "24px",
  textTransform: "uppercase",
}

export const EmailHtml = {
  Root: function EmailHtmlRoot({ children }: React.PropsWithChildren) {
    const fontElements = Font.all.flatMap((fontFamily) => {
      return fontFamily.variants.map((variant) => (
        <FontElement
          key={variant.url}
          fontFamily={fontFamily.name}
          fallbackFontFamily={fontFamily.fallbacks as unknown as FallbackFont[]}
          webFont={{
            url: `${process.env.PUBLIC_HOST}${variant.url}`,
            format: variant.format,
          }}
          fontWeight={variant.weight}
          fontStyle={variant.style}
        />
      ))
    })

    return (
      <Html lang="fr-FR">
        <Head>{fontElements}</Head>

        <Body
          style={{
            margin: 0,
            backgroundColor: Color.whiteHex,
            padding: `${Spacing.unitPx * 4}px 0`,
            overflowWrap: "break-word",
            color: Color.prussianBlueHex,
          }}
        >
          <Container
            style={{
              margin: "0 auto",
              maxWidth: 640,
              padding: "0 16px",
            }}
          >
            <Link href={process.env.PUBLIC_HOST}>
              <Img
                src={createImageUrl(
                  process.env.CLOUDINARY_CLOUD_NAME,
                  "show/logos/flat-medium-light_aoea56",
                )}
                width="72"
                height="72"
                alt="Salon des Ani'Meaux"
                style={{ margin: 0 }}
              />
            </Link>

            {children}
          </Container>
        </Body>
      </Html>
    )
  },

  Title: function EmailHtmlTitle(props: React.PropsWithChildren) {
    return (
      <Heading
        {...props}
        as="h1"
        style={{
          margin: `${Spacing.unitPx * 4}px 0 0`,
          ...TEXT_SECTION_TITLE,
          color: Color.mysticHex,
        }}
      />
    )
  },

  SectionSeparator: function EmailHtmlSectionSeparator() {
    return (
      <Hr
        style={{
          margin: `${Spacing.unitPx * 4}px 0 0`,
          borderTop: `1px solid ${Color.alabasterHex}`,
        }}
      />
    )
  },

  Footer: function EmailHtmlFooter(props: React.PropsWithChildren) {
    return (
      <EmailHtml.Section.Root>
        <Text {...props} style={{ margin: 0, ...TEXT_CAPTION }} />
      </EmailHtml.Section.Root>
    )
  },

  Paragraph: function EmailHtmlParagraph({
    _isFirst,
    ...props
  }: React.PropsWithChildren<IsFirstProps>) {
    return (
      <Text
        {...props}
        style={{
          margin: 0,
          ...TEXT_BODY,
          ...(_isFirst ? {} : { marginTop: Spacing.unitPx * 2 }),
        }}
      />
    )
  },

  Strong,

  MarkdownParagraph: function EmailHtmlMarkdownParagraph(
    props: Except<
      React.ComponentPropsWithoutRef<typeof Markdown>,
      "components"
    >,
  ) {
    return <Markdown {...props} components={EMAIL_SENTENCE_COMPONENTS} />
  },

  MarkdownDocument: function EmailHtmlMarkdownDocument({
    _isFirst,
    ...props
  }: Except<React.ComponentPropsWithoutRef<typeof Markdown>, "components"> &
    IsFirstProps) {
    return (
      <Section
        style={{
          margin: 0,
          ...(_isFirst ? {} : { marginTop: Spacing.unitPx * 4 }),
        }}
      >
        <Markdown {...props} components={EMAIL_PARAGRAPH_COMPONENTS} />
      </Section>
    )
  },

  Img: function EmailHtmlImg(
    props: React.ComponentPropsWithoutRef<typeof Img>,
  ) {
    return (
      <Img
        {...props}
        style={{
          aspectRatio: "4 / 3",
          width: "100%",
          minWidth: 0,
          borderRadius: Spacing.unitPx * 2,
          border: `1px solid ${Color.alabasterHex}`,
          objectFit: "contain",
        }}
      />
    )
  },

  Link: function EmailHtmlLink({
    children,
    ...props
  }: React.PropsWithChildren<{ href: string }>) {
    return (
      <Link
        {...props}
        style={{
          borderBottom: `1px solid ${Color.mysticHex}`,
          color: Color.prussianBlueHex,
        }}
      >
        <EmailHtml.Strong>{children}</EmailHtml.Strong>
      </Link>
    )
  },

  Button: function EmailHtmlButton({
    children,
    ...props
  }: React.PropsWithChildren<{ href: string }>) {
    return (
      <Button
        {...props}
        style={{
          borderRadius: Spacing.unitPx * 0.5,
          backgroundColor: Color.mysticHex,
          padding: `${Spacing.unitPx * 0.5}px ${Spacing.unitPx * 2}px`,
          color: Color.whiteHex,
        }}
      >
        <EmailHtml.Strong>{children}</EmailHtml.Strong>
      </Button>
    )
  },

  OrderedList: function EmailHtmlOrderedList({
    _isFirst,
    ...props
  }: React.PropsWithChildren<IsFirstProps>) {
    return (
      <ol
        {...props}
        style={{
          margin: 0,
          listStyleType: "decimal",
          paddingLeft: 16,
          ...TEXT_BODY,
          ...(_isFirst ? {} : { marginTop: Spacing.unitPx * 2 }),
        }}
      />
    )
  },

  UnorderedList: function EmailHtmlUnorderedList({
    _isFirst,
    ...props
  }: React.PropsWithChildren<IsFirstProps>) {
    return (
      <ul
        {...props}
        style={{
          margin: 0,
          listStyleType: "disc",
          paddingLeft: 16,
          ...TEXT_BODY,
          ...(_isFirst ? {} : { marginTop: Spacing.unitPx * 2 }),
        }}
      />
    )
  },

  Section: {
    Root: function EmailHtmlSectionRoot({ children }: React.PropsWithChildren) {
      const childrenElements = Children.toArray(children).filter(
        (child): child is React.ReactElement<IsFirstProps> =>
          isValidElement(child),
      )

      return (
        <Section style={{ marginTop: Spacing.unitPx * 4 }}>
          {childrenElements.map((child, index) =>
            cloneElement(child, { _isFirst: index === 0 }),
          )}
        </Section>
      )
    },

    Title: function EmailHtmlSectionTitle({
      _isFirst,
      ...props
    }: React.PropsWithChildren<IsFirstProps>) {
      return (
        <Heading
          {...props}
          as="h2"
          style={{
            margin: 0,
            ...TEXT_ITEM_TITLE,
            color: Color.mysticHex,
            ...(_isFirst ? {} : { marginTop: Spacing.unitPx * 2 }),
          }}
        />
      )
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
      )

      return (
        <table
          align="center"
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          style={{
            margin: 0,
            width: "100%",
            borderStyle: "none",
            ...(_isFirst ? {} : { marginTop: Spacing.unitPx * 2 }),
          }}
        >
          <tbody style={{ width: "100%" }}>
            {childrenElements.map((child, index) =>
              cloneElement(child, { _isFirst: index === 0 }),
            )}
          </tbody>
        </table>
      )
    },

    RowSeparator: function EmailHtmlOutputRowSeparator() {
      return (
        <tr style={{ width: "100%" }}>
          <Column style={{ paddingTop: Spacing.unitPx }}>
            <Hr
              style={{
                borderTop: `1px dashed ${Color.alabasterHex}`,
                margin: 0,
              }}
            />
          </Column>

          <Column style={{ paddingTop: Spacing.unitPx }}>
            <Hr
              style={{
                borderTop: `1px dashed ${Color.alabasterHex}`,
                margin: 0,
              }}
            />
          </Column>
        </tr>
      )
    },

    Row: function EmailHtmlOutputRow({
      _isFirst,
      children,
    }: React.PropsWithChildren<IsFirstProps>) {
      const childrenElements = Children.toArray(children).filter(
        (child): child is React.ReactElement<IsFirstProps> =>
          isValidElement(child),
      )

      return (
        <tr style={{ width: "100%" }}>
          {childrenElements.map((child) => cloneElement(child, { _isFirst }))}
        </tr>
      )
    },

    Label: function EmailHtmlOutputLabel({
      _isFirst: _isFirstRow,
      children,
    }: React.PropsWithChildren<IsFirstProps>) {
      return (
        <Column
          style={{
            width: "50%",
            paddingRight: Spacing.unitPx * 2,
            verticalAlign: "top",
            ...TEXT_CAPTION,
            ...(_isFirstRow ? {} : { paddingTop: Spacing.unitPx }),
          }}
        >
          {children}
        </Column>
      )
    },

    Value: function EmailHtmlOutputValue({
      _isFirst: _isFirstRow,
      children,
    }: React.PropsWithChildren<IsFirstProps>) {
      return (
        <Column
          style={{
            width: "50%",
            verticalAlign: "top",
            ...TEXT_BODY,
            ...(_isFirstRow ? {} : { paddingTop: Spacing.unitPx }),
          }}
        >
          {Children.toArray(children).map((child, index) => {
            if (!isValidElement(child)) {
              return child
            }

            return cloneElement(child as React.ReactElement<IsFirstProps>, {
              _isFirst: index === 0,
            })
          })}
        </Column>
      )
    },
  },
}

export type IsFirstProps = { _isFirst?: boolean }

/**
 * Not exported from @react-email/components Font.
 */
type FallbackFont = KeepString<
  React.ComponentProps<typeof FontElement>["fallbackFontFamily"]
>

type KeepString<T> = T extends string ? T : never

function Strong(props: React.PropsWithChildren<ExtraProps>) {
  return <strong {...withoutNode(props)} style={TEXT_BODY_EMPHASIS} />
}

const EMAIL_SENTENCE_COMPONENTS: MarkdownComponents = {
  ...SENTENCE_COMPONENTS,

  a: ({ children, href }) => {
    if (href == null) {
      return <span>children</span>
    }

    return <EmailHtml.Link href={href}>{children}</EmailHtml.Link>
  },

  em: (props) => (
    <em {...withoutNode(props)} style={{ ...TEXT_BODY, fontStyle: "italic" }} />
  ),

  strong: Strong,
}

const EMAIL_PARAGRAPH_COMPONENTS: MarkdownComponents = {
  ...PARAGRAPH_COMPONENTS,
  ...EMAIL_SENTENCE_COMPONENTS,

  ul: (props) => (
    <EmailHtml.UnorderedList
      {...withoutNode(props)}
      _isFirst={props.node?.position?.start.line === 1}
    />
  ),

  ol: (props) => (
    <EmailHtml.OrderedList
      {...withoutNode(props)}
      _isFirst={props.node?.position?.start.line === 1}
    />
  ),

  li: (props) => (
    <li {...withoutNode(props)} style={{ margin: 0, ...TEXT_BODY }} />
  ),

  p: (props) => (
    <EmailHtml.Paragraph
      {...withoutNode(props)}
      _isFirst={props.node?.position?.start.line === 1}
    />
  ),
}
