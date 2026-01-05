import { z } from "zod/v3";

const genderSchema = z.enum([
    "male",
    "female",
    "non_binary",
    "other",
    "prefer_not_to_say"
])

export const createUserZodSchema = z.object({
    username: z.string().min(3).max(32),
    name: z.string().min(1).max(100),
    age: z.number().int().min(13),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    gender: genderSchema.optional()
})

export const updateUserZodSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    age: z.number().int().min(13).optional(),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    gender: genderSchema.optional()
})

export const userIdParamZodSchema = z.object({
    id: z.string().min(1)
})