export interface RuntimeConfig {
    VITE_API_BASE_URL: string;
    VITE_CDN_BASE_URL: string;
}

let config: RuntimeConfig;

export async function loadConfig() {
    const res = await fetch("/config.json", {
        cache: "no-store",
    });

    config = await res.json();
}

export function getConfig() {
    return config;
}