declare const _default: () => {
    port: number;
    mongodb: {
        uri: string;
    };
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpires: string;
        refreshExpires: string;
    };
    redis: {
        url: string;
    };
    stripe: {
        secretKey: string;
        webhookSecret: string;
    };
    razorpay: {
        keyId: string;
        keySecret: string;
        webhookSecret: string;
    };
    cors: {
        origin: string[];
    };
    frontendUrl: string;
    media: {
        publicBase: string;
        uploadDir: string;
        maxVideoMb: number;
    };
    platform: {
        userId: string;
    };
};
export default _default;
