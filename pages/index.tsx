import dynamic from "next/dynamic"
import React from "react"
// import { CodeSandBoxCalendar } from "../components/calendar"
//dynamic import では export 元をexport constではなく、export default function にしないといけないみたい
const CodeSandBoxCalendar = dynamic(() => import("../components/calendar"), { ssr: false })

export default function Home() {
  return (
    <div>
      <CodeSandBoxCalendar />
    </div>
  )
}
