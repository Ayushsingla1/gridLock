import Word from "./WordSpec"

export default function RenderParagrahSpec({
    userIdx,
    paragraph,
    prevLetters, 
    currentWord,
    pointerPos,
}: {
    userIdx: 0 | 1,
    paragraph: string,
    prevLetters: number, 
    currentWord: number
    pointerPos: number
}) {
    return <div className="flex flex-wrap">
        {
            paragraph.split(" ").map((word,index) => {
                let makeGreen = false;
                if(currentWord > index){
                    makeGreen = true;
                }
                return <span 
                    id={`${`word-${index}-${userIdx}`}`}
                    className={`m-[7.2px] font-mono text-lg word-${index} ${makeGreen ? "text-green-400" : "text-white"}`}
                >
                    <Word wordIdx={index} prevLetters={prevLetters} currentWord={currentWord} word={word} pointerPos={pointerPos}/>
                </span>
            }) 
        }
    </div>
}