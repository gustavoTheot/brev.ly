import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useLinkStore } from "../../../../store/useLinks"

const formSchema = z.object({
  originUrl: z.string().url("URL original deve ser uma URL válida"),
  shortUrl: z.string(),
})

type FormShortUrl = z.infer<typeof formSchema>

export function Form() {
  const { createLink } = useLinkStore();
  const {
    register,
    handleSubmit,
  } = useForm<FormShortUrl>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: FormShortUrl) {
    await createLink(data)
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label
          className="text-gray-500 text-[10px] font-semibold" 
          htmlFor="shortUrl"
        >
          LINK ORIGINAL
        </label>      
        <input 
          type="url" 
          id="originUrl" 
          {...register("originUrl")}
          className="outline-1 outline-gray-300 rounded-md text-gray-600 px-4 py-2.5 text-sm"
          placeholder="https://exemplo.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-gray-500 text-[10px] font-semibold" 
          htmlFor="shortUrl"
        >
            LINK ENCURATADO
        </label>
        <input 
          type="text" 
          id="shortUrl"
          {...register("shortUrl")}
          className="outline-1 outline-gray-300 rounded-md text-gray-600 px-4 py-2.5 text-sm"
        />
      </div>

      <button 
        type="submit"
        className="bg-blue-800 text-gray-100 p-2 rounded-md hover:bg-blue-900 transition-colors cursor-pointer text-sm"
      >
        Salvar link
      </button>
    </form>
  )
}