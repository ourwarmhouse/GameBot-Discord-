import {IUser} from 'Database'

export default class BlackJackManager {
    constructor(private _user: IUser) {}
    public get user() {
        return this._user
    }
}
