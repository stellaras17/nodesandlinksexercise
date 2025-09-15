import moment from "moment";

export const getTimestampFromDateString = (dateString: string) => {
    let dateMomentObject = moment(dateString, "DD/MM/YYYY");
    return dateMomentObject?.valueOf()
}