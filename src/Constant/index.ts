export default class Constant {
    static prefix = '.'
    static linkRegex = new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    )
    static HOUR = 60 * 60 * 1000
    static SECOND = 1000
    static MINUTE = 60 * 1000
}