import WordSpec from "./WordSpec";

const RenderParagrahSpectator = ({
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
}) => {
    const cursorColor = userIdx === 0 ? 'text-cyan-400' : 'text-pink-400';
    return <div className="flex flex-wrap">
        {
            paragraph.split(" ").map((word,index) => {
                let makeGreen = false;
                if(currentWord > index){
                    makeGreen = true;
                }
                return <span 
                    key={index}
                    id={`${`word-${index}-${userIdx}`}`}
                    className={`m-[7.2px] font-mono text-lg word-${index} ${makeGreen ? `${cursorColor}` : "text-gray-500"}`}
                >
                    <WordSpec userIdx={userIdx} wordIdx={index} prevLetters={prevLetters} currentWord={currentWord} word={word} pointerPos={pointerPos}/>
                </span>
            }) 
        }
    </div>
}

export default RenderParagrahSpectator;