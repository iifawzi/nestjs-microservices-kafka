export default function userInfoSerializer(fullName: string, email: string, isVerified: boolean) {
    return {
        email,
        isVerified,
        fullName
    }
}