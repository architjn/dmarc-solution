import { FetchOptions, FetchResponse } from "./bin/declare";
import { fetcher } from "./bin/fetcher";
import { generator } from "./bin/generator";
import { parser } from "./bin/parser";

export const parse = async function (dmarcRecord: string) {
  var result = await parser(dmarcRecord);
  if (result.messages && result.messages.length) throw new Error(result.messages.join("."));
  return result.tags;
};

export const fetch = async function (domainName: string, options?: FetchOptions): Promise<FetchResponse> {
  const shouldDescribe = options?.describe ?? true;
  let record = await fetcher(domainName);

  const resp: FetchResponse = { record };
  if (shouldDescribe) {
    let tags = await parse(record);
    resp.tags = tags;
  }

  return resp;
};

export const generate = generator;
