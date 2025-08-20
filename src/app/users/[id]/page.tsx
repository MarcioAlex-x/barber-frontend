'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from "next/link"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { jwtDecode } from "jwt-decode"
import { Card, CardTitle } from "@/components/ui/card"


export default function UserPage() {
    const [user, setUser] = useState({
        name: '',
        id: '',
        isAdmin: '',
        email: ''
    })
    const [editedUser, setEditedUser] = useState({ name: '' })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const params = useParams()
    const { id } = params
    const [isEdting, setIsEditing] = useState(false)

    useEffect(() => {
        if (!id) {
            return
        }
        const fetchApi = async () => {
            setLoading(true)

            try {

                const token = localStorage.getItem('authToken')

                if (!token) {
                    throw new Error('Erro de autenticação. Token não encontrado.')
                }

                const responseUser = await fetch(`http://localhost:3001/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!responseUser.ok) {
                    throw new Error('Erro ao tentar buscar usuário.')
                }

                const userData = await responseUser.json()

                setUser(userData)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchApi()
    }, [id])

    const handleUpdateUser = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem('authToken')
            if (!token) {
                throw new Error('Erro ao tentar buscar os dados do usuário.')
            }

            const response = await fetch(`http://localhost:3001/users/${id}`, {
                method: 'PUT',
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editedUser)
            })

            if (!response.ok) {
                throw new Error('Falha ao tentar atualizar o usuário.')
            }

            const upadatedData = await response.json()

            setUser(upadatedData)
            setIsEditing(false)

        } catch (err) {

        }
    }

    if (loading) return <div className="w-full h-screen  flex align-center justify-center">
        <Spinner className="text-blue-500" size={64}></Spinner>
    </div>

    if (error) return (
        <Alert>
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>error</AlertDescription>
        </Alert>
    )

    return (

        <>
        <div>
                <Link className="mx-6" href='/dashboard'>Dashboard</Link>
                <Link href='/users'>Usuários</Link>
            </div>
             <h2 className="text-center text-blue-800 text-3xl">Detalhes do Usuário</h2>

            <div className="grid place-items-center mt-6">
                {isEdting ? (
                    <form
                        className="grid place-items-center"
                        onSubmit={handleUpdateUser}>
                        <Card>
                            <CardTitle className="text-center">Edite o usuário: {user.name}</CardTitle>
                            <div>
                                <Label>Nome do Usuário</Label>
                                <Input
                                type="text"
                                name="name"
                                placeholder="Informe o nome..."
                                value={editedUser.name}
                                onChange={e =>setEditedUser({...editedUser, name:e.target.value})}/>
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <Button
                                type="button"
                                variant='outline'
                                onClick={()=>{setIsEditing(false)}}>
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
                        {
                            user?.isAdmin?(<p>Administrador {user?.name} </p>):( <p>Cliente {user?.name}</p>)
                        }
                       
                        <p>Email: {user?.email}</p>
                        
                        <Button
                        className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer mx-2"
                        onClick={() => setIsEditing(true)}>Editar</Button>
                    </div>
                )}
            </div>
        </>

    )
}
