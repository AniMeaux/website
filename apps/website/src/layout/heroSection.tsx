import styled from "styled-components";
import { StaticImage } from "~/dataDisplay/image";

type HeroProps = {
  smallImage: string;
  largeImage: string;
  title: string;
  subTitle: string;
  searchForm?: React.ReactNode;
};

export function HeroSection({
  smallImage,
  largeImage,
  title,
  subTitle,
  searchForm,
}: HeroProps) {
  return (
    <Section>
      <Image smallImage={smallImage} largeImage={largeImage} alt={title} />

      <Content>
        <Title>{title}</Title>
        <Catch>{subTitle}</Catch>
        <CallToAction>{searchForm}</CallToAction>
      </Content>
    </Section>
  );
}

const Section = styled.section`
  width: 100%;
  background-image: var(--adopt-color);
`;

const Image = styled(StaticImage)`
  width: 100%;
  height: 60vh;
  object-fit: cover;

  @media (max-width: 800px) {
    height: 320px;
  }
`;

const Content = styled.header`
  padding: var(--spacing-6xl) 0;

  /* Use margin instead of padding to automatically apply spacing to the search
  form. */
  margin: 0 var(--content-margin);

  position: relative;
`;

const Title = styled.h1`
  font-family: var(--font-family-serif);
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-2xl);
  font-weight: var(--font-weight-semibold);
  text-align: center;
`;

const Catch = styled.p`
  margin-top: var(--spacing-l);
  text-align: center;
  font-size: var(--font-size-l);
  line-height: var(--line-height-l);
`;

const CallToAction = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 100%;
  max-width: 512px;
`;
