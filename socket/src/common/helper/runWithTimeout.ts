export function delay(time: number) {
    return new Promise(function (fulfill) {
        setTimeout(fulfill, time);
    });
}

export default function RunWithTimeOut<T>(promise: Promise<T>, time: number) {
    return Promise.race([promise, delay(time).then(function () {
        throw new Error('Operation timed out');
    })]);
}

