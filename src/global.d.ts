declare global {
    var db: {
        connection: any
    } | null
    var s3: {
        client: any
    } | null
}

export {}
