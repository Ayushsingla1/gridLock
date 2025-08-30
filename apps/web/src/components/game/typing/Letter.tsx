'use client'

import { useEffect, useState } from "react"

export default function Letter({
    letter,
    makeGreen
}: {
    letter: string,
    makeGreen: boolean
}) {
    return <div 
     className={`${makeGreen ? "text-green-400" : "text-inherit"} inline font-mono`}
    >
        {letter}
    </div>
}


// hi this is dev aggarwal