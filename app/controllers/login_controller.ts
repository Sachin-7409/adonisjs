import type { HttpContext } from '@adonisjs/core/http'
import { loginUser } from '#validators/user';
import User from '#models/user'
import mail from '@adonisjs/mail/services/main';

export default class LoginController {

    async show({ view }: HttpContext) {
        return view.render('login', {
            title: 'Login'
        })
    }

    async login({ request, response, auth }: HttpContext) {
        const { email, password } = await loginUser.validate(request.only(['email', 'password']));
        const user = await User.verifyCredentials(email, password)

        await auth.use('web').login(user)

        await mail.sendLater((message) => {
            message
                .to(user.email)
                .from('lGyDl@example.com')
                .subject('Welcome')
        })
        response.redirect().toRoute('index')
    }

    async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        response.redirect().toRoute('login')
    }
}