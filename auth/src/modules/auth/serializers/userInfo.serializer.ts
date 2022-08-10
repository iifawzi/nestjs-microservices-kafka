export default function userInfoSerializer(userId: string,fullName: string, email: string, isVerified: boolean) {
    return {
        userId,
        email,
        isVerified,
        fullName
    }
}