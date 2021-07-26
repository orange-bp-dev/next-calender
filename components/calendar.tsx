import dynamic from "next/dynamic"
import React, { useCallback, useRef, useState } from "react"
import Calendar from "@toast-ui/react-calendar"
import { ISchedule, ICalendarInfo } from "tui-calendar"

import "tui-calendar/dist/tui-calendar.css"
import "tui-date-picker/dist/tui-date-picker.css"
import "tui-time-picker/dist/tui-time-picker.css"
// import "./styles.css"

const start = new Date()
const end = new Date(new Date().setMinutes(start.getMinutes() + 30))

//取得してきたスケジュールのデータ
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

//設定できるカレンダーの種類を定義
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

export default function CodeSandBoxCalendar() {
  //ずっとnull
  const cal = useRef<Calendar>(null)
  const calendarRef = React.createRef<Calendar>()

  const [unit, setUnit] = useState("month")
  const [defaultStartTime, setDefaultStartTime] = useState("")
  const [defaultEndTime, setDefaultEndTime] = useState("")
  const [changedStartTime, setChangedStartTime] = useState("")
  const [changedEndTime, setChangedEndTime] = useState("")

  const onClickSchedule = useCallback((e) => {
    const cal_value = cal
    console.log("cal_value", cal)
    const instance = calendarRef.current.getInstance()
    //null
    //はいってた
    console.log("instance--------------onClickSchedule", instance)
    // console.log("クリックしたスケジュールの情報(開始)", e.schedule.start._date)
    // console.log("クリックしたスケジュールの情報(開始)", e.schedule.end._date)

    //２つとも同じ
    const { calendarId, id } = e.schedule
  }, [])

  //useState

  const onBeforeCreateSchedule = useCallback((scheduleData) => {
    // console.log("作成するまえにscheduleData-------------", scheduleData)

    const schedule = {
      id: String(Math.random()),
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: scheduleData.start,
      end: scheduleData.end,
      category: scheduleData.isAllDay ? "allday" : "time",
      dueDateClass: "",
      // location: scheduleData.location,
      raw: {
        class: scheduleData.raw["class"]
      },
      state: scheduleData.state
    }

    // cal.current.calendarInst.createSchedules([schedule])
  }, [])

  const onBeforeDeleteSchedule = useCallback((res) => {
    console.log("削除する前に res", res)

    const { id, calendarId } = res.schedule

    // cal.current.calendarInst.deleteSchedule(id, calendarId)
  }, [])

  const onBeforeUpdateSchedule = useCallback((e) => {
    //
    const instance = calendarRef.current.getInstance()
    instance.next()
    console.log("instance--------------onBeforeUpdateSchedule", instance)

    console.log("変更する前に", e)

    //null
    //でも中のObjectにcurrentが入ってた

    setDefaultStartTime(`${e.schedule.start._date}`)
    setDefaultEndTime(`${e.schedule.end._date}`)

    setChangedStartTime(`${e.changes.start._date}`)
    setChangedEndTime(`${e.changes.end._date}`)

    // ドラッグアンドドロップしてドロップしたときに作動する
    // e内でstart, endが取得できる

    // Updateリクエスト発火
    // カレンダーの横に現在設定している設定している値と、変更する値をState保持・表示してOKボタンを押したら変更

    // 不要
    // const { schedule, changes } = e
    // cal.current.calendarInst.updateSchedule(schedule.id, schedule.calendarId, changes)
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
        // html.push('<span class="calendar-font-icon ic-location-b"></span>')
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

  const toNext = () => {
    const instance = calendarRef.current.getInstance()
    console.log("next instance", instance)
    instance.next()
  }

  const toPrev = () => {
    const instance = calendarRef.current.getInstance()
    console.log("prev instance", instance)
    instance.prev()
  }

  return (
    <div className="App">
      <h1>Welcome to TOAST Ui Calendar</h1>
      <button onClick={() => setUnit("day")}>Daily</button>
      <button onClick={() => setUnit("week")}>Weekly</button>
      <button onClick={() => setUnit("month")}>Monthly</button>

      <div>
        <h2>変更前</h2>
        <h4>開始{defaultStartTime}</h4>
        <h4>終了{defaultEndTime}</h4>

        <h2>変更後</h2>
        <h4>開始{changedStartTime}</h4>
        <h4>終了{changedEndTime}</h4>

        <button>OK</button>
        <button onClick={() => toNext()}>Next</button>
        <button onClick={() => toPrev()}>Back</button>
      </div>
      <div style={{}}>
        {/* <TUICalendar ref={calendarRef} height="800px" view={unit} useCreationPopup={true} useDetailPopup={true} template={templates} calendars={calendars} schedules={schedules} onClickSchedule={onClickSchedule} onBeforeCreateSchedule={onBeforeCreateSchedule} onBeforeDeleteSchedule={onBeforeDeleteSchedule} onBeforeUpdateSchedule={onBeforeUpdateSchedule} /> */}
        {/* DynamicImportしなければrefは使える */}
        <Calendar ref={calendarRef} height="800px" view={unit} useCreationPopup={true} useDetailPopup={true} template={templates} calendars={calendars} schedules={schedules} onClickSchedule={onClickSchedule} onBeforeCreateSchedule={onBeforeCreateSchedule} onBeforeDeleteSchedule={onBeforeDeleteSchedule} onBeforeUpdateSchedule={onBeforeUpdateSchedule} />
      </div>
    </div>
  )
}
