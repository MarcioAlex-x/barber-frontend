'use client'

import { jwtDecode } from "jwt-decode"
import Link from "next/link"
import { useEffect, useState } from "react"

import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert'

import {
    Spinner,
} from '@/components/ui/shadcn-io/spinner'
import { fetchApi } from "@/lib/api"

export default function Services() {
    const [user, setUser] = useState(null)
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')



    useEffect(() => {
        const fetchData = async () => {
            setError('')
            setLoading(true)
            try {
                const serviceData = await fetchApi('services')
                setServices(serviceData)

            } catch (err) {
                setError(err.message)
                console.error('Erro na página de serviços', err)
            } finally {
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
            <AlertDescription>error</AlertDescription>
        </Alert>
    )

    return (
        <div className="px-8">
            <div>
                <Link className="ms-6" href='/dashboard'>Dashboard</Link>
            </div>
            <h1 className="text-center font-bold text-blue-600 text-3xl">Serviços</h1>
            <ul className="border p-8 text-center mt-8 border-blue-200 rounded">
                {
                    services.map(service => (
                        <li key={service.id}><Link href={`/services/${service.id}`}>{service.name}</Link> - R${service.price.replace('.', ',')}</li>
                    ))
                }
            </ul>
        </div>
    )
}
