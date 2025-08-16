'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation"
// import { api } from "@/lib/api"

export default function login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleLogin = async () =>{

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({email, password})
            })
            const data = await response.json()

            if(!response.ok){
                throw new Error(data.message || 'Falha ao fazer o login.')
            }

            if(data.token){
                localStorage.setItem('authToken',data.token)
            }

            router.push('/dashboard')

        } catch (error) {
            console.error('Erro no login: ',  error)
            alert(error.message)
        }

            
    }

    return(
        <div className="grid place-items-center h-screen">
            <div className="max-w-md">
                <Card className="text-center p-4">
                    <div>
                        <CardHeader className="text-2xl">Login</CardHeader>
                        <CardDescription className="text-sky-900">Faça login para continuar!</CardDescription>
                    </div>

                    <div className="p-2">
                        <Label className="mb-2">E-mail:</Label>
                        <Input
                            type="text"
                            placeholder="exemplo@email.com"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            />
                    </div>

                    <div className="p-2 mb-4">
                        <Label className="mb-2">Senha:</Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <Button
                        type="button"
                        className="bg-sky-600 hover:bg-sky-700 cursor-pointer"
                        onClick={handleLogin}>
                            Entrar
                    </Button>
                </Card>
            </div>
        </div>
    )
}
