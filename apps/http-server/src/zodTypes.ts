import * as z from 'zod'

export const screenNameZod = z.string().length(50);