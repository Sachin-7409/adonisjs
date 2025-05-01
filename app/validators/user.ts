import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(vine.object({
    name: vine.string(),
    email: vine.string().unique(async (db, value) => {
        const user = await db.from('users')
            .where('email', value).first()
        return !user
    }),
    password: vine.string(),
}))

export const updateUserValidtion = vine.compile(vine.object({
    name: vine.string(),
    email: vine.string(),
}))


export const loginUser = vine.compile(vine.object({
    email: vine.string(),
    password: vine.string(),
}))