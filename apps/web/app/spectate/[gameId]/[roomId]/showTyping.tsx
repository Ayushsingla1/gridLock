import { cursorPositions } from "@/types/gameTypes";
import RenderParagrahSpec from "@/components/game/typing/spectators/RenderPragraphSpec";
import { useEffect, useRef, useState } from "react";

export default function ShowTyping ({
    username,
    userIdx,
    position,
    paragraph
}: {
    username: string,
    userIdx: 0 | 1,
    position: cursorPositions, 
    paragraph: string
}) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    //  const pointerRef = useRef(0); 
    // const wordRef = useRef(0);
    // const prevLettersRef = useRef(0);

    useEffect(() => {
        canvasRef.current = document.createElement("canvas");
    }, []);

    useEffect(() => {
        console.log('hoi');
        const activeWordElement = document.getElementById(`word-${position.currentWord}-${userIdx}`);
        console.log(username, " ", activeWordElement);
        if (!activeWordElement || !canvasRef.current) return;
        console.log(username, " ", canvasRef.current)

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        ctx.font = "18px monospace"; 

        const wordText = activeWordElement.textContent ?? "";
        const typedSoFar = position.pointerPos - position.prevLetters - position.currentWord; 
        const substring = wordText.slice(0, typedSoFar);
        const offsetX = ctx.measureText(substring).width;
        const rect = activeWordElement.getBoundingClientRect();
        const containerRect = activeWordElement.offsetParent?.getBoundingClientRect();
        const left = rect.left - (containerRect?.left ?? 0) + offsetX;
        const top = rect.top - (containerRect?.top ?? 0);

        const cursor = document.getElementById(`caret-${userIdx}`);

        if (cursor) {
            cursor.style.left = `${left - 2}px`;
            cursor.style.top = `${top}px`;
        }
    }, [position])


    return <div className="text-2xl w-8/12 h-6/12 relative rounded-lg p-4">
        <div
        id={`caret-${userIdx}`}
        className={`absolute h-[28px] bg-amber-300 w-[2px] rounded-full`}
        ></div>
        <div className="">
            <RenderParagrahSpec 
                userIdx={userIdx} 
                paragraph={paragraph}
                prevLetters={position.prevLetters} 
                currentWord={position.currentWord}
                pointerPos={position.pointerPos}
            />
        </div>
    </div>
}