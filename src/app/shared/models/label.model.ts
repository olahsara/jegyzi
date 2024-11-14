/** Címke kollekció */
export interface LabelGroup {
  name: string;
  id: string;
  items: Label[];
}

/** Címke csoport tagjainak az interfésze */
export interface Label {
  value: string;
  id: string;
}

/** A jegyzeteknek megadott címkék interfésze */
export interface LabelNote {
  groupId: string;
  label: Label;
}
