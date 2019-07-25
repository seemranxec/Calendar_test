import * as moment from 'moment';


export interface CalendarDate {
  momentDate: moment.Moment;
  today?: boolean;
  isSelectedMonth: boolean;
  isHoliday: boolean;
}
