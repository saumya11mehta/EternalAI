"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '@/components/chat/Chat';
import Loading from '@/components/general/Loading';

const HomeMain = () => {
	const router = useRouter();
	const [isLoading,setIsLoading] = useState(true)
	const [userId,setUserId] = useState<string | null>(null)

	useEffect(() => {
		// Check if user is logged in and has user ID set in local storage
		const isLoggedIn = localStorage.getItem('userId'); // Assuming user ID is stored as 'userId' in local storage

		if (!isLoggedIn) {
			// Redirect to login page
			router.push('/login');
		}else{
			setUserId(isLoggedIn);
			setIsLoading(false);
		}
	}, []);

	return (
		<main>
			{isLoading && <Loading />}
			{(!isLoading && userId) && <Chat userId={userId}/>}
		</main>
	);
};

export default HomeMain;