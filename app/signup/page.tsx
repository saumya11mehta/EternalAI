'use client';
import Logo from "@/image/logo/Logo";
import Text from "@/image/logo/Text";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUp: React.FC = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const router = useRouter();

	const handleSignUp = async () => {
		try {
			setErrorMessage('')
			const response = await fetch('/api/signup', { // Adjust this endpoint to match your actual signup endpoint
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, email, password }),
			});
			const reply = await response.json();
			if (response.ok) {
				localStorage.setItem('userId', reply.userId); // Save user ID to local storage
				router.push('/'); // Redirect to homepage
			}
			if(reply.error) {
				setErrorMessage(reply.error);
			}
		} catch (error) {
			console.error('Error occurred during sign-up:', error);
		}
	};

	return (
		<main className="flex flex-wrap min-h-screen flex-col items-center p-10">
			<div className="flex items-center justify-center">
				<Logo className="w-1/4 p-3" />
				<Text className="w-1/2" />
			</div>
			<div className="flex flex-col items-center w-2/4 basis-full shrink-0 flex-grow bg-gray-900 border rounded-lg border-gray-900">
				<div className="text-3xl font-bold p-10">Sign up for Eternal</div>
				<div className="w-2/4 p-10">
					<div>
						{
								errorMessage != '' && <div className="text-center p-5">
									<p className="text-red-500 text-sm text-bold">{errorMessage}</p>
								</div>
						}
						<label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Username
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className={(errorMessage != '' ? "border-red-500 focus:ring-red-500 " : "border-gray-600 focus:ring-gray-400 focus:border-gray-400 ") + "bg-gray-700 border  text-white text-sm rounded-lg outline-0  placeholder-gray-400 block w-full p-2.5"}
							placeholder="Username"
							required
						/>
					</div>
					<br />
					<div>
						<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Email
						</label>
						<input
							type="text"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={(errorMessage != '' ? "border-red-500 focus:ring-red-500 " : "border-gray-600 focus:ring-gray-400 focus:border-gray-400 ") + "bg-gray-700 border  text-white text-sm rounded-lg outline-0  placeholder-gray-400 block w-full p-2.5"}
							placeholder="Email"
							required
						/>
					</div>
					<br />
					<div>
						<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={(errorMessage != '' ? "border-red-500 focus:ring-red-500 " : "border-gray-600 focus:ring-gray-400 focus:border-gray-400 ") + "bg-gray-700 border  text-white text-sm rounded-lg outline-0  placeholder-gray-400 block w-full p-2.5"}
							placeholder="Password"
							required
						/>
					</div>
					<br />
					<div className="flex items-center justify-center">
						<button type="button" onClick={handleSignUp} className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 w-full">
							<div className="flex items-center justify-center">
								<Logo width="35" height="35" />
								<span className="pl-1">Sign Up</span>
							</div>
						</button>
					</div>
					<div className="text-white text-center my-4">Or</div>
					<div className="flex flex-col items-center justify-center">
						<button type="button" onClick={() => router.push('/login')} className="text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-green-500 dark:hover:bg-green-400 dark:focus:ring-green-800 w-full group">
							<div className="flex items-center justify-center">
								<Logo className="group-hover:rotate-45" width="35" height="35" />
								<span className="pl-1">Login</span>
							</div>
						</button>
					</div>
					<br />
				</div>
			</div>
		</main>
	)
};

export default SignUp;

