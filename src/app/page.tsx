import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid place-items-center h-screen">
      <div className="max-w-4xl">
        <h1 className="text-black text-center text-4xl text-center text-sky-900">Boas vindas ao Sistema de gerencimaneto Barber-X</h1>
        <p className="text-center">Encontre serviços e usuários de forma rápida através dos nossos buscadores.</p>
        <Link href='/login'>
        <p className="text-center mt-2 text-blue-500">Ir para Login</p>
        </Link>
      </div>
    </div>
  );
}
