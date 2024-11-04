import { useApi } from "@/app/api";
import { useEffect } from "react";

export default function WelcomePage() {
    const api = useApi();

    useEffect(() => { api.ensureLogin(); }, [api])

    return <>
        Welcome, {api.userStore.user?.username}! This page is for authenticated users only.
    </>
}