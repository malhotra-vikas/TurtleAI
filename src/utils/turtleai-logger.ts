export function customLogger(message: string) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message)
    }
}

export function customContextLogger(message: string, context: any) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message, context)
    }
}


