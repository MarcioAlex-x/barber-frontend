'use client'

import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert'

import {
    Spinner,
} from '@/components/ui/shadcn-io/spinner'


export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const token = localStorage.getItem('authToken')
                if (!token) {
                    router.replace('/login')
                    return
                }

                const decodedUser = jwtDecode(token)
                if (!decodedUser.isAdmin) {
                    router.replace('/dashboard')
                    return
                }

                const usersResponse = await fetch('http://localhost:3001/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!usersResponse.ok) {
                    throw new Error('Falha ao tentar listar usuários.')
                }

                const data = await usersResponse.json()

                setUsers(data)

            } catch (err) {
                setError(err.message)
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchApi()

    }, [router])

    if (loading) return <div className="w-full h-screen  flex align-center justify-center">
        <Spinner className="text-blue-500" size={64} />
    </div>

    if (error) return (
        <Alert>
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>error</AlertDescription>
        </Alert>)

    return (
        <div>
            <div>
                <Link className="ms-6" href='/dashboard'>Dashboard</Link>
            </div>
            <div className="grid place-items-center">
                <h2 className="text-center text-blue-800 text-2xl mb-6">
                    Lista de usuários
                </h2>
                {
                    users.map(userData => (
                        <ul className="w-md">
                            <Link href={`/users/${userData.id}`}>
                                <li
                                    key={userData.id}
                                    className="border rounded px-8 py-2 mb-2 text-left"
                                >
                                    {userData.name}
                                </li>
                            </Link>
                        </ul>
                    ))
                }
            </div>
        </div>
    )
}
