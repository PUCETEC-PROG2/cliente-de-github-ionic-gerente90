import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";

const GITHUB_API_URL = "https://api.github.com";

// IMPORTANTE: Reemplaza esto con tu token de GitHub personal
// Genera uno en: https://github.com/settings/tokens
// O usa variable de entorno REACT_APP_GITHUB_TOKEN
const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

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
        const repositories: RepositoryItem[] = response.data.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            owner: repo.owner ? repo.owner.login : null,
            description: repo.description ? repo.description : null,
            ownerAvatarUrl: repo.owner ? repo.owner.avatar_url : null,
            imageUrl: repo.owner ? repo.owner.avatar_url : null,
            language: repo.language ? repo.language : null,
        }));
        return repositories;
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}