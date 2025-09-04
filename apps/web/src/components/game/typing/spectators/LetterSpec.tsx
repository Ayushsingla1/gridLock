'use client'
export default function LetterSpec({
    letter,
    makeGreen,
    userIdx
}: {
    letter: string,
    makeGreen: boolean,
    userIdx: 0 | 1 
}) {
    const cursorColor = userIdx === 0 ? 'text-cyan-400' : 'text-pink-400';
    return <div 
     className={`${makeGreen ? `${cursorColor}` : "text-inherit"} inline font-mono`}
    >
        {letter}
    </div>
}