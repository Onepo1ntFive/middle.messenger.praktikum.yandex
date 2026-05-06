function parseMessageTime(time: string) {
    if (time === undefined) {
        return null
    }
    const date = new Date(time);
    return {
        time: `${ date.getHours() }:${ date.getMinutes() }`,
        date: `${ date.getDate() }.${ (date.getMonth() + 1).toString().padStart(2, '0') }.${ date.getFullYear() }`
    }
}

export default parseMessageTime;
