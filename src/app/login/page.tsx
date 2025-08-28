'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation"
import { fetchLogin } from "@/lib/api";

export default function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const handleLogin = async (e) =>{
        e.preventDefault()

        setError('')
        setIsLoading(true)
        try {
            const data = await fetchLogin(email,password)

            if(data.token){
                localStorage.setItem('authToken',data.token)
                router.push('/dashboard')
            }
        } catch (err) {
            console.error('Erro no login: ', err.message)
            setError(err.message)
        }finally{
            setIsLoading(false)
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

                    <form onSubmit={handleLogin}>
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
                            type="submit"
                            className="bg-sky-600 hover:bg-sky-700 cursor-pointer">
                                Entrar
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}
