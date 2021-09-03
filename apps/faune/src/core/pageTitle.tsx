import Head from "next/head";

export type PageTitleProps = {
  title?: string | null;
};

export function PageTitle({ title }: PageTitleProps) {
  return (
    <Head>
      <title>{title ?? process.env.NEXT_PUBLIC_APP_NAME}</title>
    </Head>
  );
}
