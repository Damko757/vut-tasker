import type { User } from "../Entities/User.ts";

interface Globals {
    USERS: User[];
}
export const Globals: Globals = {
    USERS: [
        {
            nick: "User1",
            fullname: "Userus",
            color: "#008000",
            show_my_progress: true,
            show_me_progress: true,
        },
        {
            nick: "User2",
            fullname: "Serus",
            color: "#250018",
            show_my_progress: true,
            show_me_progress: true,
        },
        {
            nick: "User3",
            fullname: "Sures",
            color: "#123456",
            show_my_progress: true,
            show_me_progress: true,
        },
    ],
};
