export type IInterpretationResult = {
  createdAt: string;
  id: string;
  interpretationResult: string;
  mimeType: string;
  url: string;
  promptMessage: string;
  title: string;
  docId: string;
};
export type IInterpretationResultRecords = {
  records: IInterpretationResult[];
};

export type IInterpretationRecord = {
  [date: string]: IInterpretationResult[] | null;
};
export type IInterpretationResponse = {
  record: IInterpretationRecord;
  success: boolean;
};
