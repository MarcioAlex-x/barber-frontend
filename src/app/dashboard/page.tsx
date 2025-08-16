'use client'

import { useState, useEffect } from "react"
import { jwtDecode } from 'jwt-decode'
import Link from "next/link"

export default function Dasboard() {
    const [user, setUser] = useState(null)
    const [services, setServices] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [adminDasboardMessageFor, setAdminDashboardFor] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken')
                if (!token) {
                    throw new Error("Acesso negado.")
                }

                const decodedUser = jwtDecode(token)
                setUser(decodedUser)

                const servicesResponse = await fetch('http://localhost:3001/services', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!servicesResponse.ok) {
                    throw new Error('Falha ao tentar encotrar os serviços.')
                }

                const servicesData = await servicesResponse.json()
                setServices(servicesData)

                if (decodedUser.isAdmin) {
                    const usersResponse = await fetch('http://localhost:3001/users', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if (!usersResponse.ok) {
                        throw new Error('Falha ao tentar buscar usuários.')
                    }

                    const usersData = await usersResponse.json()
                    setUsers(usersData)

                }

                
                setAdminDashboardFor(' e usuários')

            } catch (err) {
                setError(err.message)
                console.log('Erro no Dashboard', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // if(loading)

    // if(error)

    return (
        <div className="flex min-h-screen">
            <aside className="text-xl font-bold mb-4 p-6 border rounded mx-2">
                <h2 className="text-lg font-semibold">Menu</h2>
                <section className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-600"><Link href='/services'>Serviços</Link></h3>
                    <ul className="list-disc list-none mt-2 space-y-1">
                        {
                            services.map(service=>(
                                <li key={service.id}>{service.name}</li>
                            ))
                        }
                    </ul>
                </section>
                <hr />
                <section className="mt-6">
                    <h3 className="text-lg font-semibold text-blue-600"><Link href='/users'>Usuários</Link></h3>
                    <ul className="list-disc list-none mt-2 space-y-1">
                        {
                            users.map(u =>(
                                <li key={u.id}>{u.name}</li>
                            ))
                        }
                    </ul>
                </section>
            </aside>
            <main className="flex-1 p-8">
                <h1 className="text-4xl font-bold text-center">Painel</h1>
                <p className="text-center text-blue-800 mt-6 text-2xl">Veja todos os <span className="font-semibold"><Link href='/services'>serviços</Link></span> <span className="font-semibold"><Link href='/users'>{adminDasboardMessageFor}</Link></span></p>
            </main>
        </div>
    )
}
