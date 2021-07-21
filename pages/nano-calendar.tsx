import Calendar from "@toast-ui/react-calendar"
import React from "react"
import "tui-calendar/dist/tui-calendar.css"

// If you use the default popups, use this.
import "tui-date-picker/dist/tui-date-picker.css"
import "tui-time-picker/dist/tui-time-picker.css"

export default function NanoCalendar() {
  const calendarRef = React.createRef<Calendar>()

  return (
    <div>
      <Calendar
        ref={calendarRef}
        height="75vh"
        usageStatistics={false}
        disableDblClick={true}
        disableClick={false}
        isReadOnly={true}
        // schedules={schedules}
        scheduleView={["time"]}
        taskView={false}
        // onClickSchedule={(sch) => handleShowDetail(sch.schedule)}
        month={{
          daynames: ["日", "月", "火", "水", "木", "金", "土"],
          isAlways6Week: false
        }}
        week={{
          daynames: ["日", "月", "火", "水", "木", "金", "土"],
          showTimezoneCollapseButton: false,
          timezonesCollapsed: true,
          hourStart: 9,
          hourEnd: 21
        }}
        template={{
          timegridDisplayPrimayTime: (time) => {
            if (time.minutes == 0) {
              return `${time.hour}:00`
            }
            return `${time.hour}:${time.minutes}`
          }
        }}
        view="week"
      />
    </div>
  )
}
