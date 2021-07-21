import dynamic from "next/dynamic"
import React, { useCallback, useRef, useState } from "react"
import Calendar from "@toast-ui/react-calendar"
const TUICalendar = dynamic(() => import("@toast-ui/react-calendar"), { ssr: false })
import { ISchedule, ICalendarInfo } from "tui-calendar"

import "tui-calendar/dist/tui-calendar.css"
import "tui-date-picker/dist/tui-date-picker.css"
import "tui-time-picker/dist/tui-time-picker.css"
// import "./styles.css"

const start = new Date()
const end = new Date(new Date().setMinutes(start.getMinutes() + 30))

//取得してきたデータ
const schedules: ISchedule[] = [
  {
    calendarId: "1",
    category: "time",
    isVisible: true,
    title: "Study",
    id: "1",
    body: "Test",
    start,
    end
  },
  {
    calendarId: "2",
    category: "time",
    isVisible: true,
    title: "Meeting",
    id: "2",
    body: "Description",
    start: new Date(new Date().setHours(start.getHours() + 1)),
    end: new Date(new Date().setHours(start.getHours() + 2))
  }
]

const calendars: ICalendarInfo[] = [
  {
    id: "1",
    name: "My Calendar",
    color: "#ffffff",
    bgColor: "#9e5fff",
    dragBgColor: "#9e5fff",
    borderColor: "#9e5fff"
  },
  {
    id: "2",
    name: "Company",
    color: "#ffffff",
    bgColor: "#00a9ff",
    dragBgColor: "#00a9ff",
    borderColor: "#00a9ff"
  }
]

export const CodeSandBoxCalendar = () => {
  const cal = useRef(null)
  console.log("calの挙動", cal)

  const onClickSchedule = useCallback((e) => {
    //２つとも同じ
    const { calendarId, id } = e.schedule

    console.log("e.calendar", e.schedule)
    //取得できる
    console.log("calendarId", calendarId)
    console.log("id", id)
    //クリックしても初期値のnullが入る
    console.log("cal", cal)
    // const el = cal.current.calendarInst.getElement(id, calendarId)
    // console.log("default-----------", e, el.getBoundingClientRect())
  }, [])

  const onBeforeCreateSchedule = useCallback((scheduleData) => {
    console.log("作成するまえにscheduleData-------------", scheduleData)

    const schedule = {
      id: String(Math.random()),
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: scheduleData.start,
      end: scheduleData.end,
      category: scheduleData.isAllDay ? "allday" : "time",
      dueDateClass: "",
      location: scheduleData.location,
      raw: {
        class: scheduleData.raw["class"]
      },
      state: scheduleData.state
    }

    cal.current.calendarInst.createSchedules([schedule])
  }, [])

  const onBeforeDeleteSchedule = useCallback((res) => {
    console.log("削除する前に res", res)

    const { id, calendarId } = res.schedule

    cal.current.calendarInst.deleteSchedule(id, calendarId)
  }, [])

  const onBeforeUpdateSchedule = useCallback((e) => {
    console.log("変更する前に", e)

    const { schedule, changes } = e

    cal.current.calendarInst.updateSchedule(schedule.id, schedule.calendarId, changes)
  }, [])

  function _getFormattedTime(time) {
    const date = new Date(time)
    const h = date.getHours()
    const m = date.getMinutes()

    return `${h}:${m}`
  }

  function _getTimeTemplate(schedule, isAllDay) {
    var html = []

    if (!isAllDay) {
      html.push("<strong>" + _getFormattedTime(schedule.start) + "</strong> ")
    }
    if (schedule.isPrivate) {
      html.push('<span class="calendar-font-icon ic-lock-b"></span>')
      html.push(" Private")
    } else {
      if (schedule.isReadOnly) {
        html.push('<span class="calendar-font-icon ic-readonly-b"></span>')
      } else if (schedule.recurrenceRule) {
        html.push('<span class="calendar-font-icon ic-repeat-b"></span>')
      } else if (schedule.attendees.length) {
        html.push('<span class="calendar-font-icon ic-user-b"></span>')
      } else if (schedule.location) {
        html.push('<span class="calendar-font-icon ic-location-b"></span>')
      }
      html.push(" " + schedule.title)
    }

    return html.join("")
  }

  const templates = {
    time: function(schedule) {
      console.log("templatesレンダリング時に表示", schedule)
      return _getTimeTemplate(schedule, false)
    }
  }
  const [unit, setUnit] = useState("month")

  return (
    <div className="App">
      <h1>Welcome to TOAST Ui Calendar</h1>
      <button onClick={() => setUnit("day")}>Daily</button>
      <button onClick={() => setUnit("week")}>Weekly</button>
      <button onClick={() => setUnit("month")}>Monthly</button>
      <TUICalendar height="1000px" view={unit} useCreationPopup={true} useDetailPopup={true} template={templates} calendars={calendars} schedules={schedules} onClickSchedule={onClickSchedule} onBeforeCreateSchedule={onBeforeCreateSchedule} onBeforeDeleteSchedule={onBeforeDeleteSchedule} onBeforeUpdateSchedule={onBeforeUpdateSchedule} />
    </div>
  )
}
