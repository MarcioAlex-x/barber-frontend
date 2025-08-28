'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from "next/link"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardTitle } from "@/components/ui/card"
import { fetchApi } from "@/lib/api"
import { useRouter } from "next/navigation"


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
    const router = useRouter()

    useEffect(() => {
        if (!id) {
            return
        }
        const fetchUser = async () => {
            setLoading(true)

            try {


                const userData = await fetchApi(`users/${id}`)

                setUser(userData)

            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [id])

    const handleUpdateUser = async (e) => {
        e.preventDefault()

        try {

            const fetchUser = await fetchApi(`users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(editedUser)
            })

            setUser(fetchUser)
            setIsEditing(false)

        } catch (err) {

        }
    }

    const handleDeleteService = async () => {
        const fetchUser = await fetchApi(`users/${id}`, {
            method: 'DELETE'
        })

        if (!fetchUser.ok) {
            setError('Erro ao tentar exluir o usuário.')
        }

        alert('Usuário apagdo com sucesso.')
        router.push('/dashboard')
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
                                    onChange={e => setEditedUser({ ...editedUser, name: e.target.value })} />
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant='outline'
                                    onClick={() => { setIsEditing(false) }}>
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
                            user?.isAdmin ? (<p>Administrador {user?.name} </p>) : (<p>Cliente {user?.name}</p>)
                        }

                        <p>Email: {user?.email}</p>

                        <Button
                            className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer mx-2"
                            onClick={() => setIsEditing(true)}>
                            Editar
                        </Button>

                        <Button
                            className="bg-red-500 hover:bg-red-600 cursor-pointer mx-2"
                            onClick={handleDeleteService}>
                            Excluir
                        </Button>
                    </div>
                )}
            </div>
        </>

    )
}
