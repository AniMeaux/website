import { Image as BaseImage } from "core/dataDisplay/image";
import styled from "styled-components";
import { theme } from "styles/theme";

type ImageSlideshowProps = {
  images: string[];
  alt: string;
};

export function ImageSlideshow({ images, alt }: ImageSlideshowProps) {
  return (
    <Section>
      {images.map((pictureId, pictureIndex) => (
        <Item key={pictureId}>
          <Image alt={`${alt} ${pictureIndex + 1}`} image={pictureId} />

          {images.length > 1 && (
            <Counter>
              {pictureIndex + 1}/{images.length}
            </Counter>
          )}
        </Item>
      ))}
    </Section>
  );
}

const Section = styled.section`
  overflow: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: ${theme.spacing.x4};
  display: flex;

  &::after {
    content: "";
    display: flex;
    width: ${theme.spacing.x4};
    flex: none;
  }
`;

const Item = styled.div`
  position: relative;
  flex: none;
  scroll-snap-align: start;
  width: calc(100% - 2 * ${theme.spacing.x4});

  &:first-child {
    margin-left: ${theme.spacing.x4};
  }

  &:not(:first-child) {
    margin-left: ${theme.spacing.x2};
  }
`;

const Image = styled(BaseImage)`
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.m};
`;

const Counter = styled.span`
  position: absolute;
  top: ${theme.spacing.x1};
  right: ${theme.spacing.x1};
  padding: ${theme.spacing.x1} ${theme.spacing.x2};
  background: ${theme.colors.dark[800]};
  color: white;
  border-radius: ${theme.borderRadius.full};
  font-size: 12px;
  line-height: ${theme.typography.lineHeight.monoLine};
  font-weight: 500;
`;
