'use client';

import React from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const Page = () => {
  return (
    <div>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Tldraw />
      </div>
    </div>
  )
}

export default Page