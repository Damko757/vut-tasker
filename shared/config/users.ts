import type { User } from "../Entities/User.ts";

export const USERS: User[] = [
  {
    nick: "User1",
    subscribed_subjects: [],
    color: "#008000",
    show_my_progress: true,
    show_me_progress: true,
    forename: "Forename1",
    surname: "Surname1",
    xlogin: "xuser01",
  },
  {
    nick: "User2",
    subscribed_subjects: [],
    color: "#250018",
    show_my_progress: true,
    show_me_progress: true,
    forename: "Forename2",
    surname: "Surname2",
    xlogin: "xuser02",
  },
  {
    nick: "User3",
    subscribed_subjects: [],
    color: "#123456",
    show_my_progress: true,
    show_me_progress: true,
    forename: "Forename3",
    surname: "Surname3",
    xlogin: null,
  },
];
