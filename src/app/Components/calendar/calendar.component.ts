import { Component, OnInit, ElementRef } from '@angular/core';
//import moment from 'moment';
import * as moment from 'moment';
import { CalendarDate } from 'src/app/Models/Date';
import * as _ from 'lodash';
import * as holidaylist from '../../Source/holiday-list.json';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  public currentDate = moment();
  public daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  public daysInCurrentMonth = [];
  public weeks: CalendarDate[][] = [];
  public isHolidayClicked = false;
  public holidayInfo;

  constructor(private el: ElementRef) { }
  ngOnInit() {
    this.generateDaysOfAMonth(this.currentDate);
    this.createCalendar();
  }
  chooseMonth(action) {
    switch (action) {
      case "previous":
        this.currentDate = moment(this.currentDate).subtract(1, 'months');
        this.createCalendar();
        break;
      case "next":
        this.currentDate = moment(this.currentDate).add(1, 'months');
        this.createCalendar();
        break;
    }
    this.isHolidayClicked = false;
  }

  /*--------- Method for creating Weeks by using Splice and ultimately producing the Calendar data-----
  Reference -- http://www.bentedder.com/create-calendar-grid-component-angular-4/----------------*/
  createCalendar() {
    const daysInCurrentMonth = this.generateDaysOfAMonth(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (daysInCurrentMonth.length > 0) {
      weeks.push(daysInCurrentMonth.splice(0, 7));
    }
    this.weeks = weeks;
  }

  /*---------Method for mapping and returning 42 Days with reference to todays date-------------
  Reference -- http://www.bentedder.com/create-calendar-grid-component-angular-4/----------------*/
  generateDaysOfAMonth(current: moment.Moment): CalendarDate[] {
    const firstDayOfMonth = moment(current).startOf('month').day();
    const firstDayOfGrid = moment(current).startOf('month').subtract(firstDayOfMonth, 'days');
    const startRange = firstDayOfGrid.date();

    return _.range(startRange, startRange + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          momentDate: d,
          isHoliday: this.checkIfHoliday(d.format("LL")),
          isSelectedMonth: this.isSelectedMonth(d)
        };
      });
  }
  checkIfHoliday(date) {
    let intersection = this.filterOnHolidayList(date);
    if (intersection.length)
      return true;
    else
      return false;
  }
  getHolidayInfoOnClick(event, date) {
    let hInfo = this.filterOnHolidayList(date);
    if (hInfo.length) {
      this.isHolidayClicked = true;
      this.holidayInfo = hInfo[0].holiday;
    }
    else {
      this.isHolidayClicked = false;
    }
    this.setActiveClass(event);
  }

  /*-------------Single Responsiblity functions-------------*/
  filterOnHolidayList(date) {
    return holidaylist.filter(element => moment(date).isSame(element.date));
  }
  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }
  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }
  setActiveClass(currentEvent) {
    let list_elements = this.el.nativeElement.querySelectorAll("li");
    list_elements.forEach(element => {
      element.classList.remove('active');
    });
    currentEvent.srcElement.classList.add('active');
  }
}
