import process from 'process';

export function errorExit(err: any) {
    console.error(err)
    exit(1);
}

function exit(code: number) {
    process.exit(code);
}

process.on('SIGINT', () => {
    console.log(`process.on('SIGINT')`);
    exit(0);
});

process.on('SIGTERM', () => {
    console.log(`process.on('SIGTERM')`);
    exit(0);
});

process.on('uncaughtException', (error) => {
    if (error instanceof Error) {
        if (error.stack) {
            console.error(`process.on('uncaughtException') ${error.stack}`)
        } else {
            console.error(`process.on('uncaughtException') ${error.name}: ${error.message}`)
        }
    }
    else {
        console.error(`process.on('uncaughtException') ${error}`)
    }
    // exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    if (reason instanceof Error) {
        if (reason.stack) {
            console.error(`process.on('unhandledRejection') ${reason.stack}`)
        } else {
            console.error(`process.on('unhandledRejection') ${reason.name}: ${reason.message}`)
        }
    }
    else {
        console.error(`process.on('unhandledRejection') ${reason}`)
    }
    // exit(1);
});

