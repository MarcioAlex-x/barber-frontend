'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ServicePage() {

    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const params = useParams()
    const { id } = params

    useEffect(() => {

        if (!id) {
            return
        }

        const fetchApi = async () => {
            setLoading(true)

            try {

                const token = localStorage.getItem('authToken')

                if (!token) {
                    throw new Error('Erro de autorização. Token não encontrado.')
                }

                const serviceResponse = await fetch(`http://localhost:3001/services/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!serviceResponse.ok) {
                    throw new Error('Erro ao tentar buscar os dados do serviço.')
                }

                const data = await serviceResponse.json()
                setService(data)
            } catch (err) {
                setError(err.message)
            }finally{
                setLoading(false)
            }

        }

        fetchApi()
        
        
    }, [id])
    if(loading){
        return <div>Carregando...</div>
    }

    if(error){
        return <div>Erro: {error}</div>
    }
    return (
        <div>
            <p>{id}</p>
            <p>Nome: {service?.name}</p>
        </div>
    )
}