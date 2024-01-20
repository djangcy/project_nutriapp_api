import { ZodError } from 'zod';

export const zodErrorToString = (error: ZodError): string => {
  return `[
    ${error.errors
      .map((e) => {
        return `{
        code: ${e.code},
        message: ${e.message},
        path: ${e.path},
      }`;
      })
      .join(', ')}
    ]`;
};
