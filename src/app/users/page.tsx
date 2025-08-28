'use client'

import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import Link from "next/link"

import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert'

import {
    Spinner,
} from '@/components/ui/shadcn-io/spinner'
import { fetchApi } from "@/lib/api"


export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () =>{
            setLoading(true)
            setError('')

            try {
                const userData = await fetchApi('users')
                setUsers(userData)
            } catch (err) {
                setError(err.message)
                console.log('Erro ao buscar usuários: ',err.message)
            }finally{
                setLoading(false)
            }
        }
        fetchData()

    }, [])

    if (loading) return <div className="w-full h-screen  flex align-center justify-center">
        <Spinner className="text-blue-500" size={64} />
    </div>

    if (error) return (
        <Alert>
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
                    users.map(user => (
                        <ul className="w-md">
                            <Link href={`/users/${user.id}`}>
                                <li
                                    key={user.id}
                                    className="border rounded px-8 py-2 mb-2 text-left"
                                >
                                    {user.name}
                                </li>
                            </Link>
                        </ul>
                    ))
                }
            </div>
        </div>
    )
}
