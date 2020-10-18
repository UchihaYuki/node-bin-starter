import process from 'process';
import { log, LogLevel } from 'thelog';

export function errorExit(err: any) {
    log(LogLevel.Error, err);
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
            log(LogLevel.Error,`process.on('uncaughtException') ${error.stack}`)
        } else {
            log(LogLevel.Error,`process.on('uncaughtException') ${error.name}: ${error.message}`)
        }
    }
    else {
        log(LogLevel.Error,`process.on('uncaughtException') ${error}`)
    }
    // exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    if (reason instanceof Error) {
        if (reason.stack) {
            log(LogLevel.Error,`process.on('unhandledRejection') ${reason.stack}`)
        } else {
            log(LogLevel.Error,`process.on('unhandledRejection') ${reason.name}: ${reason.message}`)
        }
    }
    else {
        log(LogLevel.Error,`process.on('unhandledRejection') ${reason}`)
    }
    // exit(1);
});

