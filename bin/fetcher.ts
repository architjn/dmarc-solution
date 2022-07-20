import { promises } from "dns";
import { normalize } from "./error";
const dns = new promises.Resolver();

export const fetcher = async (domainName: string) => {
  const resp: string[][] | Error = await dns.resolveTxt(`_dmarc.${domainName}`).catch(normalize);
  if (resp instanceof Error && resp.message?.startsWith("queryTxt ENOTFOUND")) throw new Error("DMARC Record not available");
  if (resp instanceof Error) throw resp;

  let record = null;
  for (let i = 0; i < resp.length; i++) {
    if (!resp[i]?.join("")?.startsWith("v=DMARC")) continue;
    record = resp[i].join("");
    break;
  }

  if (!record) throw new Error("DMARC Record not available");
  return record;
};
