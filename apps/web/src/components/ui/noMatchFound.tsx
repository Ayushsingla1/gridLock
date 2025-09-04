'use client'

import { motion } from 'motion/react';
import { SearchX, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NoMatchFound() {
    const router = useRouter();

    return (
        <main className="bg-black-900 text-slate-200 h-10/12 flex justify-center items-center p-4">
            <motion.div
                className="flex flex-col items-center gap-6 p-10 bg-slate-800/50 rounded-2xl shadow-2xl border border-slate-700/60 w-full max-w-md"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
                {/* Icon */}
                <SearchX className="h-20 w-20 text-red-500/80" />

                {/* Main Text */}
                <h1 className="text-3xl font-bold text-center text-slate-100">
                    Match Not Found
                </h1>

                {/* Helper Text */}
                <p className="text-center text-slate-400">
                    The match you're looking for might have ended or the link is incorrect.
                </p>

                {/* Back Button */}
                <motion.button
                    onClick={() => router.back()} // Navigates to the previous page
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronLeft className="h-5 w-5" />
                    Go Back
                </motion.button>
            </motion.div>
        </main>
    );
}