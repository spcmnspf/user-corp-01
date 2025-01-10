import { useEffect } from 'react';
import { nhost } from '@/utils/nhost';
import { useRouter } from 'next/router';

const CallbackPage = () => {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Handle the OAuth callback
                await nhost.auth.getSession();
                router.push('/'); // Redirect to the home page after successful login
            } catch (error) {
                console.error('Error handling OAuth callback:', error);
                router.push('/login'); // Redirect to login page on error
            }
        };

        handleCallback();
    }, [router]);

    return <div>Loading...</div>; // Show a loading spinner while handling the callback
};

export default CallbackPage;