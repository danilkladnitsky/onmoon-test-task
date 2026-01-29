export const appConfig = {
    socketUrl: import.meta.env.PROD ? "wss://onmoon.kladnitsky.ru:3000" : 'ws://localhost:3000',
    backendUrl: import.meta.env.PROD ? "https://onmoon.kladnitsky.ru:3000" : 'http://localhost:3000',
}