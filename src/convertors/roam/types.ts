export interface RoamNote {
  title: string;
  uid: string;
  "edit-time": number;
  children?: RoamNoteString[];
}
export interface RoamNoteString {
  string: string;
  "create-time": number;
  uid: string;
  "edit-time": number;
  children?: RoamNoteString[];
}
