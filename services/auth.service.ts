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
                let message = "Error al iniciar sesión";

                if (response.status === 401 || response.status === 403) {
                    message = "Email o contraseña incorrectos.";
                } else if (response.status >= 500) {
                    message = "Error del servidor al iniciar sesión. Intenta nuevamente más tarde.";
                }

                const error: any = new Error(message);
                error.status = response.status;
                throw error;
            }

            const json = await response.json();
            return json.data || json; // Fallback to json if data is missing
        } catch (error) {
            throw error;
        }
    },
};
