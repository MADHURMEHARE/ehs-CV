"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthHeaderButton() {
	const pathname = usePathname()
	const router = useRouter()
	const [hasToken, setHasToken] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setHasToken(!!localStorage.getItem('token'))
		}
	}, [pathname])

	if (pathname === '/login') return (
		<div className="flex items-center gap-2">
			<Link href="/signup" className="btn-secondary">Sign Up</Link>
		</div>
	)
	if (pathname === '/signup') return (
		<div className="flex items-center gap-2">
			<Link href="/login" className="btn-secondary">Sign In</Link>
		</div>
	)

	if (!hasToken) {
		return (
			<div className="flex items-center gap-2">
				<Link href="/signup" className="btn-secondary">Sign Up</Link>
				<Link href="/login" className="btn-primary">Sign In</Link>
			</div>
		)
	}

	return (
		<button
			className="btn-secondary"
			onClick={() => {
				localStorage.removeItem('token')
				router.push('/login')
			}}
		>
			Sign Out
		</button>
	)
}
