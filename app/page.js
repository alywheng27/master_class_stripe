'use client'

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.getAllTasks);

  return (
    <>
      <h1>All Tasks</h1>
      <main className="flex flex-col">
        {
          tasks?.map(({ _id, text, isCompleted }) =>
            <div key={_id}>{text} - {isCompleted ? "true" : "false"}</div>
          )
        }
      </main>
    </>
  )
}
