import Word from "./Word"

export default function RenderParagrah({
    paragraph,
    prevLetters, 
    currentWord,
    pointerPos,
}: {
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
                    id={`${index == currentWord ? `word-active` : `word-${index}`}`}
                    key={index}
                    className={`m-[7.2px] font-mono text-lg word-${index} ${makeGreen ? "text-green-400" : "text-white"}`}
                >
                    <Word wordIdx={index} prevLetters={prevLetters} currentWord={currentWord} word={word} pointerPos={pointerPos}/>
                </span>
            }) 
        }
    </div>
}