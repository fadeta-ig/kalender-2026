export type HolidayType = "libur" | "cuti-bersama";

export type Holiday = {
  date: string; // Format: YYYY-MM-DD
  name: string;
  type: HolidayType;
};

export type SKBMemberInfo = {
  decreeNumber: string;
  signedDate: string;
  signatories: string[];
  description: string;
};

export type YearHolidayData = {
  year: number;
  holidays: Holiday[];
  jointLeave: Holiday[];
  skbInfo: SKBMemberInfo;
};
