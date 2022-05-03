import logoImage from './assets/mickey.png'

export default class Constant {
    static prefix = '.'
    static linkRegex = new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    )
    static ONE_HOUR = 60 * 60 * 1000
    static logo = logoImage
}
