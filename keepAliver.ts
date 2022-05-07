import express, {Request, Response} from 'express'

const server = express()

server.all('/', (req: Request, res: Response) => {
    res.send('Bot is waked up')
})

export function keepAliver() {
    server.listen(process.env.PORT, () => {
        console.log('Server at port: ' + process.env.PORT)
    })
}
