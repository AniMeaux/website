import { ChildrenProp } from "core/types";
import { StaticImage, useImageDominantColor } from "dataDisplay/image";
import styled from "styled-components";

type ImageProps = {
  smallImage: string;
  largeImage: string;
};

type PageHeaderProps = ChildrenProp & {
  title: string;
} & (ImageProps | {});

function isImageProps(props: any): props is ImageProps {
  return "smallImage" in props && "largeImage" in props;
}

export function PageHeader({ title, children, ...rest }: PageHeaderProps) {
  const [dominantColor] = useImageDominantColor({
    src: isImageProps(rest) ? rest.smallImage : "",
  });

  return (
    <Header style={{ background: dominantColor?.withAlpha(0.2).toRgba() }}>
      {isImageProps(rest) && <Image {...rest} alt={title} />}

      <Content>
        <Title>{title}</Title>
        {children}
      </Content>
    </Header>
  );
}

const Header = styled.header`
  background: var(--blue-gradient);
`;

const Image = styled(StaticImage)`
  width: 100%;
  height: 60vh;
  object-fit: cover;

  @media (max-width: 800px) {
    height: 320px;
  }
`;

const Content = styled.div`
  padding: var(--spacing-6xl) 0;

  /* Use margin instead of padding to automatically apply spacing to the search
  form. */
  position: relative;
  margin: 0 var(--content-margin);

  text-align: center;
`;

const Title = styled.h1`
  font-family: var(--font-family-serif);
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-2xl);
  font-weight: var(--font-weight-semibold);
`;
