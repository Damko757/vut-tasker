export interface User {
    _id?: string;
    nick: string;
    fullname: string;
    color: string; //Hex
    show_my_progress: boolean;
    show_me_progress: boolean;
    subscribed_subjects: string[];
}
