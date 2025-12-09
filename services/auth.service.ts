import { API_URL } from "@/constants/config";

export interface AuthResponse {
    token: string;
    user: {
        email: string;
        name: string;
    };
}

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en la autenticación");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
};
