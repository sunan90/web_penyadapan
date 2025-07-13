'use client'

import { use } from "react";
export default function Page({ params }) {
  // asynchronous access of `params.id`.
  const { id } = use(params)
  return <p>ID: {id}</p>
}