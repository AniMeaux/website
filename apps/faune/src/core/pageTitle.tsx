import Head from "next/head";

export type PageTitleProps = {
  title?: string | null;
};

export function PageTitle({ title }: PageTitleProps) {
  return (
    <Head>
      <title>{title ?? "Faune Ani'Meaux"}</title>
    </Head>
  );
}
