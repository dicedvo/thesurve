import { QuerySerializerOptions } from "@hey-api/client-axios";
import { stringify } from "qs";

export const createQuerySerializer = <T = unknown>({
  allowReserved,
  array,
  object,
}: QuerySerializerOptions = {}) => {
  const querySerializer = (queryParams: T) => {
    return stringify(queryParams, {
      arrayFormat: 'indices',
      allowDots: object?.style === 'deepObject',
      encode: false,
      serializeDate: (d: Date) => d.toISOString(),
    });
  };
  return querySerializer;
};
