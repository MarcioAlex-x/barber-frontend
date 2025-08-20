'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
import { Card, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { jwtDecode } from "jwt-decode"

export default function ServicePage() {

    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isAdmin, setIsAdmin] = useState(null)
    const params = useParams()
    const { id } = params
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)
    const [editedService, setEditedService] = useState({ name: '' })

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
            } finally {
                setLoading(false)
            }

        }

        fetchApi()


    }, [id])

    const handleUpdateService = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem('authToken')

            if (!token) {
                throw new Error('Erro ao tentar buscar os dados do serviço.')
            }

            const decodedUser = jwtDecode(token)
            setIsAdmin(decodedUser.isAdmin)

            const response = await fetch(`http://localhost:3001/services/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedService)
            })

            if (!response.ok) {
                throw new Error('Falha ao tentar atualizar o serviço.')
            }

            const updatedData = await response.json()

            setService(updatedData)
            setIsEditing(false)

        } catch (err) {
            console.log(err.message)
            setError(err.message)
        }
    }

    const handleDeleteService = async () => {
        if (!window.confirm('Está certo de que deseja excluir o serviço?')) {
            return
        }
        try {
            const token = localStorage.getItem('authToken')

            

            if (!token) {
                throw new Error('Não autorizado')
            }

            const response = await fetch(`http://localhost:3001/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Falha ao tentar excluir o serviço.")
            }

            alert('Serviço excluído com sucesso.')
            router.push('/dashboard')

        } catch (err) {
            console.log(err.message)
            setError(err.message)
        }
    }


    if (loading) {
        return <div>Carregando...</div>
    }

    if (error) {
        return <div>Erro: {error}</div>
    }
    return (
        <div>
            <div>
                <Link className="ms-6" href='/dashboard'>Dashboard</Link>
            </div>
            <h2 className="text-center text-blue-800 text-3xl">Detalhes do Serviço</h2>
            <div className="grid place-items-center mt-6">
                {
                    isEditing ? (
                        <form 
                            className="grid place-items-center"
                            onSubmit={handleUpdateService}
                        >
                            <Card className="p-8">
                                <CardTitle className="text-center">Edite o Serviço: {service?.name}</CardTitle>
                                <div>
                                    <Label className="text-left">
                                        Nome do Serviço
                                    </Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Nome do serviço"
                                        value={editedService.name}
                                        onChange={e => setEditedService({ ...editedService, name: e.target.value })}
                                    />
                                </div>

                                <div className="mt-6 flex justify-end gap-4">
                                    <Button
                                    type="button"
                                    variant='outline'
                                    onClick={()=>setIsEditing(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600">
                                        Salvar
                                    </Button>
                                </div>

                            </Card>
                        </form>
                    ) : (

                        <div className="border rounded p-8 w-lg text-center text-2xl">
                            <p>Nome: {service?.name}</p>
                            <Button
                                className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer mx-2"
                                onClick={() => {setIsEditing(true)
                                    setEditedService(service)
                                }}>
                                    Editar
                            </Button>

                            <Button
                                className="bg-red-500 hover:bg-red-600 cursor-pointer mx-2"
                                onClick={handleDeleteService}>
                                    Excluir
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}