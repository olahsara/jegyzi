export interface LabelGroup {
  name: string;
  id: string;
  items: Label[];
}

export interface Label {
  value: string;
  id: string;
}

export interface LabelNote {
  groupId: string;
  label: Label;
}
