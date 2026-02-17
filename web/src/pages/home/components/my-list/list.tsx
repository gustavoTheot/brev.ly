import { useEffect, useState } from "react";
import { useLinks } from "../../../../store/useLinks";
import type { LinkResponse } from "../../../../dto/link-DTO";
import { Copy, Trash } from "lucide-react";

export function List() {
  const { getAll } = useLinks();
  const [links, setLinks] = useState<LinkResponse[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const links = await getAll();
      setLinks(links);
    } 
    fetchLinks();
  }, [])

  return (
    <div>
      {links.map((link: LinkResponse) => (
        <div
          className="flex flex-row justify-between border-t border-gray-200 p-2"
          key={link.id}
        >
          <div>
            <span>{link.shortUrl}</span>
            <span>{link.originalUrl}</span>
          </div>

          <span>
            {link.userCounter} {link.userCounter === 1 ? "acesso" : "acessos"}
          </span>
          
          <div>
            <button type="button">
              <Copy size={18} />
            </button>
            <button type="button">
              <Trash size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}