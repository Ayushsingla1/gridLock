'use client'

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