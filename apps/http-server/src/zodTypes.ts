import * as z from 'zod'

export const screenNameZod = z.string().max(50);
export const XUserName = z.string().max(50);
export const GameZod = z.enum(['Typing', 'Chess', 'Pictionary'])