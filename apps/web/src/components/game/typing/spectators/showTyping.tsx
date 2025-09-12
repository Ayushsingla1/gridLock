import { cursorPositions } from "@/types/gameTypes";
import { useEffect, useRef} from "react";
import {motion} from 'motion/react'
import RenderParagrahSpectator from "../Spectators/RenderPragraphSpec";

export default function ShowTyping({
    userIdx,
    position,
    paragraph
}: {
    userIdx: 0 | 1,
    position: cursorPositions,
    paragraph: string
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        canvasRef.current = document.createElement("canvas");
    }, []);

    useEffect(() => {
        const activeWordElement = document.getElementById(`word-${position.currentWord}-${userIdx}`);
        if (!activeWordElement || !canvasRef.current) return;
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
    }, [position,userIdx])

    const cursorColor = userIdx === 0 ? 'bg-cyan-400' : 'bg-pink-400';

    return (
        <div className="text-lg w-full bg-slate-800/60 border border-slate-700/80 relative rounded-xl p-6 shadow-inner">
            {/* Animated Blinking Caret */}
            <motion.div
                id={`caret-${userIdx}`}
                className={`absolute h-[24px] ${cursorColor} w-[2.5px] rounded-full`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="leading-relaxed tracking-wider">
                <RenderParagrahSpectator
                    userIdx={userIdx}
                    paragraph={paragraph}
                    prevLetters={position.prevLetters}
                    currentWord={position.currentWord}
                    pointerPos={position.pointerPos}
                />
            </div>
        </div>
    )
}