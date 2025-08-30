export interface ServiceEmail {
  send: (template: ServiceEmail.TemplateParam) => Promise<void>;
}

export namespace ServiceEmail {
  export type Template = {
    /** The name of the template for debug purposes. */
    name: string;

    from: string;
    to: string[];
    subject: string;
    body: React.ReactElement;
  };

  export type TemplateParam =
    | null
    | ServiceEmail.Template
    | Promise<null | ServiceEmail.Template>;
}
