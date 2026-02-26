import type { LinkResponse } from "../../../../dto/link-DTO";
import { BrushCleaning, Copy, Trash } from "lucide-react";
import { useEffect } from "react";
import { useLinkStore } from "../../../../store/useLinks";

export function List() {
  const { links, remove, getAll } = useLinkStore();

  useEffect(() => {
    getAll();
    const handleWindowFocus = () => {
      getAll();
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [getAll]);

  async function handleDeleteLink(id: string) {
    await remove(id);
  }

  return (
    <div className="max-h-[350px] overflow-y-scroll scroll-smooth">
      { links.length === 0 ? (
        <div className="flex flex-col items-center gap-2 mt-10">
          <BrushCleaning className="text-zinc-300" size={32} />
          <span className="text-zinc-300! font-semibold">Nenhum link encurtado ainda</span>
        </div>
      ) :

      links.map((link: LinkResponse) => (
        <div
          className="flex flex-row justify-between items-center border-t border-gray-200 p-2 gap-2 min-w-0"
          key={link.id}
        >
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="group relative">
              <a 
                href={`/redirect/${link.shortUrl}`}
                target="_blank"
                className="cursor-pointer block truncate text-blue-700! font-semibold">
                {link.shortUrl}
              </a>

            </div>
            
            <div className="group relative">
              <a 
                className="cursor-pointer block truncate text-gray-600 text-sm"
                href={link?.originalUrl} 
                target="_blank"
                rel="noreferrer"
              >
                {link.originalUrl}
              </a>
              <span className="absolute hidden group-hover:block bg-gray-800 text-gray-300 text-sm rounded p-2 mt-1 z-10 max-w-xs break-all">
                {link.originalUrl}
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 shrink-0">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {link.userCounter} {link.userCounter === 1 ? "acesso" : "acessos"}
            </span>
            
            <div className="flex flex-row gap-1.5">
              <button 
                type="button"
                className="flex flex-row items-center gap-1 bg-gray-200 text-gray-600 text-sm rounded-md p-1.5 cursor-pointer"
              >
                <Copy size={12} />
              </button>
              <button 
                type="button"
                onClick={() => handleDeleteLink(link.id)}
                className="flex flex-row items-center gap-1 bg-gray-200 text-gray-600 text-sm rounded-md p-1.5 cursor-pointer "
              >
                <Trash size={12}/>
              </button>
            </div>
           </div>
        </div>
      ))}
    </div>
  )
}