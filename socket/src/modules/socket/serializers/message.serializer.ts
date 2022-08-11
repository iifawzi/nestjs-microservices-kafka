export default function serializeSocketMessage(message: string, user: string, fullName: string) {
    return {
        message,
        user,
        fullName
    }
}