import { ValueTransformer } from 'typeorm';

export const lowercaseTransformer: ValueTransformer = {
    to: (entityValue: string | null) => {
      return (entityValue === null) ? entityValue : entityValue.toLocaleLowerCase();
    },
    from: (databaseValue: unknown) => {
      return databaseValue;
    },
};

export const uppercaseTransformer: ValueTransformer = {
  to: (entityValue: string | null) => {
    return (entityValue === null) ? entityValue : entityValue.toLocaleUpperCase();
  },
  from: (databaseValue: unknown) => {
    return databaseValue;
  },
};