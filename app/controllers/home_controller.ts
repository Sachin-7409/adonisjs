// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http";
import User from '#models/user'
import UserInterface from "../interfaces/userInterface";
import { createUserValidator, updateUserValidtion } from '#validators/user';
import { cuid } from "@adonisjs/core/helpers";
import app from "@adonisjs/core/services/app";

export default class HomeController {

    async index({ view }: HttpContext) {
        const users = await User.query();
        return view.render('index', { users })
    }

    async create({ view }: HttpContext) {
        return view.render('create')
    }

    async store({ request, response }: HttpContext) {
        const data: UserInterface = await createUserValidator.validate(request.only(['name', 'email', 'password']))
        const avatar = request.file('avatar', {
            size: '2mb',
            extnames: ['jpg', 'png', 'gif'],
        })
        await avatar?.move(app.makePath('uploads'), { name: `${cuid()}.${avatar?.extname}` })
        data.avatar = avatar?.fileName
        await User.create(data)
        return response.redirect().toRoute('index')
    }

    async edit({ params, view }: HttpContext) {
        const user = await User.findOrFail(params.id)
        return view.render('edit', { user })
    }

    async update({ params, request, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        const data: UserInterface = await updateUserValidtion.validate(request.all())
        const hashPassword = request.input('password') ? request.input('password') : request.input('old_password');
        data.password = hashPassword

        const avatar = request.file('avatar', {
            size: '2mb',
            extnames: ['jpg', 'png', 'gif'],
        })

        if (avatar) {
            await avatar?.move(app.makePath('uploads'), { name: `${cuid()}.${avatar?.extname}` })
            data.avatar = avatar?.fileName
        }
        user.merge(data)
        await user.save()
        return response.redirect().toRoute('index')
    }

    async destroy({ params, response }: HttpContext) {
        const user = await User.findOrFail(params.id)
        await user.delete()
        return response.redirect().toRoute('index')
    }

    async view({ params, view }: HttpContext) {
        const user = await User.findOrFail(params.id)
        return view.render('view', { user })
    }
}