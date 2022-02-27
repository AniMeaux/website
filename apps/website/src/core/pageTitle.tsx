import Head from "next/head";

type PageTitleProps = {
  title?: string;
};

export function PageTitle({ title }: PageTitleProps) {
  let pageTitle = "Ani'Meaux";

  if (title != null) {
    pageTitle = `${title} • ${pageTitle}`;
  }

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}
