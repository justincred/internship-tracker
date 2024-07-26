import { Internship } from "@prisma/client";

export type InitialInternshipData = Omit<
    Internship,
    "id" | "companyId" | "userId" | "createdAt" | "updatedAt"
>;
// export enum Status {
//     YetToApply,
//     Applied,
//     Interviewing,
//     Offer,
//     Rejected,
// }
// export interface Interview {
//     date: Date;
//     interviewer: string;
//     stage: number;
//     notes: string;
// }
// export interface Internship {
//     id: number;
//     isFavourite: boolean;

//     //Job details
//     companyName: string; //
//     companyWebsite?: string;
//     position: string;
//     jobDescription: string;

//     //Application details
//     status: Status;
//     appliedDate: Date; //application period
//     isInterviewing: boolean;
//     interview?: Interview;
// }
