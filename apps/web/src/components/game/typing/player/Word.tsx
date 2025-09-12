import Letter from "./Letter"

export default function Word({ 
    word, 
    wordIdx,
    currentWord,
    pointerPos,
    prevLetters
}: { 
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

                return <Letter
                    key={index} 
                    letter={letter} 
                    makeGreen={makeGreen}
                />
            })
        }
    </span>
}