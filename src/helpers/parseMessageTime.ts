function parseMessageTime(time: string) {
    if (time === undefined) {
        return null
    }
    const date = new Date(time);
    return {
        time: `${ date.getHours().toString().padStart(2, '0') }:${ date.getMinutes().toString().padStart(2, '0') }`,
        date: `${ date.getDate().toString().padStart(2, '0') }.${ (date.getMonth() + 1).toString().padStart(2, '0') }.${ date.getFullYear() }`
    }
}

export default parseMessageTime;
