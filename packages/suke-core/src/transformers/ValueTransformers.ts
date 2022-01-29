import { ValueTransformer } from 'typeorm';

export const lowercaseTransformer: ValueTransformer = {
    to: (entityValue: string) => {
      return entityValue.toLocaleLowerCase();
    },
    from: (databaseValue: string) => {
      return databaseValue;
    },
};

export const uppercaseTransformer: ValueTransformer = {
  to: (entityValue: string) => {
    return entityValue.toLocaleUpperCase();
  },
  from: (databaseValue: string) => {
    return databaseValue;
  },
};