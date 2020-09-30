import { errorExit } from './init/process';

async function main() {
    try {        
        console.log("Hello World!")
    } catch (error) {
        errorExit(error);
    }
}

main();