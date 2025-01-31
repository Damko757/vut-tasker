export interface User {
  _id?: string;
  nick: string;
  forename: string | null;
  surname: string | null;
  xlogin: string | null;
  color: string; //Hex
  show_my_progress: boolean;
  show_me_progress: boolean;
  subscribed_subjects: string[];
}
