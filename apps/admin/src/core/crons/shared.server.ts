export type CronDefinition = {
  name: string;

  // https://crontab.guru/
  // https://croner.56k.guru/usage/pattern/
  pattern: string;

  fn: () => Promise<void>;
};
