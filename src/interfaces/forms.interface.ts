export interface IDisputeForm {
  dispute?: {
    groupId?: string | number;
    groupIndex?: string | number;
  };
}

export interface ICreateDisputeForm {
  dispute?: {
    groupId?: string | number;
    point?: string;
    needQtyMembers?: number;
    qtyAnswers?: number;
    uriString?: string;

    uploadPreview?: string;
    answerData?: IAnswer[];
  };
}

export interface IAnswer {
  id?: number;
  answer?: string;
  image?: string;
  tokenURI?: string;
}
