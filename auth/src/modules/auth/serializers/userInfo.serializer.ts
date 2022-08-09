export default function userInfoSerializer(email: string, isVerified: boolean) {
    return {
        email,
        isVerified
    }
}