import { ValueTransformer } from 'typeorm';
import { hideEmail } from "@suke/suke-util/src/hideEmail";

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

export const hideEmailTransformer : ValueTransformer = {
  to : (entityValue : string | null) => {
    return entityValue;
  },
  from : (entityValue : string | null) => {
    return (entityValue === null) ? entityValue : hideEmail(entityValue);
  }
};