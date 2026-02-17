import { Loader2 } from "lucide-react";
import LogoIcon from "../../assets/logo_icon.svg";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useLinkStore } from "../../store/useLinks";

export function Redirect() {
  const { shortUrl } = useParams();
  const { getOriginUrl } = useLinkStore();
  const [error, setError] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    async function handleRedirect() {
      if (!shortUrl) return;

      if (hasFetched.current) return;

      hasFetched.current = true;

      const originalUrl = await getOriginUrl(shortUrl);

      if (originalUrl) {
        setTimeout(() => {
          window.location.href = originalUrl;
        }, 2000);
      } else {
        setError(true);
      }
    }

    handleRedirect();
  }, [shortUrl])

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <p className="text-red-500 font-semibold">Link não encontrado.</p>
        <a href="/" className="mt-4 text-blue-600 hover:underline">Voltar para Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center justify-center w-full max-w-xl bg-gray-50 py-6 rounded-md shadow-sm">
        <img src={LogoIcon} alt="Logo" />

        <Loader2 className="size-8 animate-spin text-blue-800 my-4" />
        
        <span>
          O link será aberto automaticamente em alguns instantes. 
        </span>
        <span>
          Não foi redirecionado? <a className="text-blue-800 font-semibold hover:underline" href="/home">Acesse aqui</a>
        </span>
      </div>
    </div>
  )
}