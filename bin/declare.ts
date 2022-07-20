export type FetchOptions = {
  describe?: boolean;
};
export type FetchResponse = {
  record: string;
  tags?: any;
};

export type DMARCRecord = {
  v: string;
  p: string;
  rua: string[];
  ruf: string[];
  fo: string[];
  pct: number; //integer value from 0 to 100
  rf: "afrf" | "iodef"; //must be one or more of these string values: afrf, iodef
  ri: number; //must be an unsigned integer
  sp: "none" | "quarantine" | "reject"; //must be one of: none, quarantine, reject
  aspf: "r" | "s"; //must be one of "r" or "s"
  adkim: "r" | "s"; //must be one of "r" or "s"
};
