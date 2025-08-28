'use client'

import { useState, useEffect } from "react"
import { jwtDecode } from 'jwt-decode'
import Link from "next/link"
import { fetchApi } from "@/lib/api"

export default function Dasboard() {
    const [user, setUser] = useState(null)
    const [services, setServices] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await fetchApi('users')
                setUsers(usersData)

                const servicesData = await fetchApi('services')
                setServices(servicesData)

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
                <p className="text-center text-blue-800 mt-6 text-2xl">Veja todos os <span className="font-semibold"><Link href='/services'>serviços</Link> e </span> <span className="font-semibold"><Link href='/users'>Usuários</Link></span></p>
            </main>
        </div>
    )
}
