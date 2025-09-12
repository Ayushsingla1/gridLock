import LetterSpec from "./LetterSpec";

export default function WordSpec({ 
    word, 
    wordIdx,
    currentWord,
    pointerPos,
    prevLetters,
    userIdx
}: { 
    userIdx: 0 | 1,
    word: string, 
    wordIdx: number,
    currentWord: number, 
    pointerPos: number,
    prevLetters: number 
}) {
    return <span className="text-inherit">
        {
            [...word].map((letter, index) => {
                let makeGreen = false;
                if (wordIdx <= currentWord && prevLetters + currentWord + index < pointerPos) {
                    makeGreen = true;
                }

                return <LetterSpec 
                    key={index}
                    letter={letter} 
                    userIdx={userIdx}
                    makeGreen={makeGreen}
                />
            })
        }
    </span>
}