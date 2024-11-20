"use server";

import { ExternalSecretProps } from "@/app/(external)/access/page";
import userApi from "@/services/api/modules/user-api";
import axios from "axios";

interface ExternalUser {
    username: string;
    password: string;
    expiredDate: string;
}

export const addMemberToSystem = async (secret: ExternalSecretProps): Promise<ExternalUser | undefined> => {
    try {
        let serverURL = (process.env.NEXT_PUBLIC_SERVER_URL ?? '') + '/api/auth/secret-check';
        const result = await axios.post(serverURL, secret)
        const { username, password, expiredDate } = result.data

        return {
            username,
            password,
            expiredDate
        }
    } catch (err) {
        console.error(err)
    }
}

