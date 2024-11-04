import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container } from "rsuite";

export default function Index() {
    const router = useRouter();
    useEffect(() => {
        router.push('/welcome')
    }, [])

    return <Container>

    </Container>
}