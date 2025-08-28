const apiUrl = 'http://localhost:3001'

export const fetchLogin = async (email, password) =>{
  const response = await fetch(`${apiUrl}/auth/login`,{
    method: 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify({email, password})
  })

  if(!response.ok){
    const errorData = await response.json().catch(()=>({message:'Credenciais inválidas.'}))
    throw new Error(errorData.message || 'Falha no login.')
  }

  return response.json()
}

export const fetchApi = async (endPoint, options={}) =>{
  const token = localStorage.getItem('authToken')
  if(!token){
    throw new Error('Não autorzizado. Faça login outra vez.')
  }

  const defaultHearders = {
    'Content-Type':'application/json',
    'Authorization':`Bearer ${token}`
  }

  const response = await fetch(`${apiUrl}/${endPoint}`,{
    ...options,
    headers:{
      ...defaultHearders,
      ...options.headers,
    }
  })
  if(!response.ok){
    const errorData = await response.json()
    throw new Error(errorData || 'Falha na solicitação.')
  }

  return response.json()
}
