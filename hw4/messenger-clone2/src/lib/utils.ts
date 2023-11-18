import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// this utility function is used to merge tailwind classes safely
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function validateUsername(username?: string | null) {
    if (!username) return false;
    return username.length<50;
}

function validateDate(date: string){  //YYYY-MM-DD HH
    const regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2})/;
    const result =  date.match(regex);
    if ( result == null )
        return false;

    const Year = Number(result[1]);
    const Month = Number(result[2]);
    const Day = Number(result[3]);
    const Hour = Number(result[4]);
    
    const limitInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];  //每月最大日期限制
    if(Month < 1 || Month > 12)
        return false;
    if(Hour < 0 || Hour > 24 )
        return false;
    const isLeap = new Date(Year, 1, 29).getDate() === 29; //是否為閏年

    if (isLeap) 
        limitInMonth[1] = 29;
    
    const final = (Day > 0 && Day <= limitInMonth[Month - 1]);
    if (!final)
        return false;
    else{
        const setDate = new Date(Year, Month, Day, Hour);
        return setDate;
    }
}

export function validateStartEnd(startTime: string, endTime: string){
    const start = validateDate(startTime);
    const end = validateDate(endTime);
    if(start==false)
        return "請輸入正確的開始日期時間";
    if(end == false)
        return "請輸入正確的結束日期時間";
    if(end.getTime() - start.getTime() < 0 )
        return "開始時間需早於結束時間";
    if( (end.getTime() - start.getTime())/(24*60*60*1000) >= 8 )
        return "開始與結束時間僅能相差最多7天"
    return true;
}