'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function UserPage(){
    const [user,setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const params = useParams()
    const { id } = params

    useEffect(()=>{
        
    })
   
    return(
        <div>
            <p>{id}</p>
        </div>
    )
}
