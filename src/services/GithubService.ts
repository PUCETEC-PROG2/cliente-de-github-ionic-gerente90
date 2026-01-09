import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";

const GITHUB_API_URL = "https://api.github.com";

// IMPORTANTE: Reemplaza esto con tu token de GitHub personal
// Genera uno en: https://github.com/settings/tokens
// O usa variable de entorno REACT_APP_GITHUB_TOKEN
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

export type CreateRepositoryPayload = {
    name: string;
    description?: string;
    private?: boolean;
    autoInit?: boolean;
};

export type UpdateRepositoryPayload = {
    name?: string;
    description?: string | null;
    private?: boolean;
};

export interface RepositoryDetail extends RepositoryItem {
    fullName?: string;
    htmlUrl?: string;
    stargazersCount?: number;
    forksCount?: number;
    openIssuesCount?: number;
    defaultBranch?: string;
    visibility?: string;
}

const mapRepository = (repo: any): RepositoryItem => ({
    id: repo.id,
    name: repo.name,
    owner: repo.owner ? repo.owner.login : null,
    description: repo.description ? repo.description : null,
    ownerAvatarUrl: repo.owner ? repo.owner.avatar_url : null,
    imageUrl: repo.owner ? repo.owner.avatar_url : null,
    language: repo.language ? repo.language : null,
});

export const fetchRepositories = async () : Promise<RepositoryItem[]>  => {
    try {
        // Si no hay token, retornar array vacío
        if (!GITHUB_API_TOKEN) {
            console.warn("No GitHub token configured. Set REACT_APP_GITHUB_TOKEN in .env");
            return [];
        }

        const response = await axios.get(`${GITHUB_API_URL}/user/repos`, {
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            },
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
            },
        });
        const repositories: RepositoryItem[] = response.data.map((repo: any) => mapRepository(repo));
        return repositories;
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}

export const createRepository = async (payload: CreateRepositoryPayload): Promise<RepositoryItem> => {
    if (!GITHUB_API_TOKEN) {
        throw new Error("Configura tu token de GitHub en VITE_GITHUB_TOKEN para crear repositorios.");
    }

    try {
        const requestBody = {
            name: payload.name,
            description: payload.description,
            private: payload.private ?? false,
            auto_init: payload.autoInit ?? true,
        };

        const response = await axios.post(`${GITHUB_API_URL}/user/repos`, requestBody, {
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            },
        });

        return mapRepository(response.data);
    } catch (error: any) {
        const message = error?.response?.data?.message || "Error al crear el repositorio.";
        throw new Error(message);
    }
}

export const updateRepository = async (
    owner: string,
    repoName: string,
    payload: UpdateRepositoryPayload
): Promise<RepositoryItem> => {
    if (!GITHUB_API_TOKEN) {
        throw new Error("Configura tu token de GitHub en VITE_GITHUB_TOKEN para actualizar repositorios.");
    }

    if (!owner || !repoName) {
        throw new Error("Datos del repositorio incompletos.");
    }

    try {
        const response = await axios.patch(
            `${GITHUB_API_URL}/repos/${owner}/${repoName}`,
            {
                name: payload.name,
                description: payload.description,
                private: payload.private,
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_API_TOKEN}`,
                },
            }
        );

        return mapRepository(response.data);
    } catch (error: any) {
        const message = error?.response?.data?.message || "Error al actualizar el repositorio.";
        throw new Error(message);
    }
}

export const deleteRepository = async (owner: string, repoName: string): Promise<void> => {
    if (!GITHUB_API_TOKEN) {
        throw new Error("Configura tu token de GitHub en VITE_GITHUB_TOKEN para eliminar repositorios.");
    }

    if (!owner || !repoName) {
        throw new Error("Datos del repositorio incompletos.");
    }

    try {
        await axios.delete(`${GITHUB_API_URL}/repos/${owner}/${repoName}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            },
        });
    } catch (error: any) {
        const message = error?.response?.data?.message || "Error al eliminar el repositorio.";
        throw new Error(message);
    }
}

export const fetchRepositoryById = async (id: string | number): Promise<RepositoryDetail | null> => {
    if (!id) {
        return null;
    }

    try {
        const response = await axios.get(`${GITHUB_API_URL}/repositories/${id}`, {
            headers: GITHUB_API_TOKEN
                ? {
                    Authorization: `Bearer ${GITHUB_API_TOKEN}`,
                }
                : undefined,
        });

        const data = response.data;
        const detail: RepositoryDetail = {
            ...mapRepository(data),
            fullName: data.full_name,
            htmlUrl: data.html_url,
            stargazersCount: data.stargazers_count,
            forksCount: data.forks_count,
            openIssuesCount: data.open_issues_count,
            defaultBranch: data.default_branch,
            visibility: data.visibility,
        };

        return detail;
    } catch (error) {
        console.error("Error fetching repository detail:", error);
        return null;
    }
}

export const fetchUserInfo = async (): Promise<UserInfo | null> => {
    try {
        if (!GITHUB_API_TOKEN) {
            console.warn("No GitHub token configured. Set REACT_APP_GITHUB_TOKEN in .env");
            return null;
        }

        const response = await axios.get(`${GITHUB_API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${GITHUB_API_TOKEN}`,
            },
        });

        const data = response.data;
        const userInfo: UserInfo = {
            id: data.id,
            login: data.login,
            name: data.name,
            avatarUrl: data.avatar_url,
            bio: data.bio,
            location: data.location,
            blog: data.blog,
            company: data.company,
            followers: data.followers,
            following: data.following,
            publicRepos: data.public_repos,
            htmlUrl: data.html_url,
        };

        return userInfo;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}
