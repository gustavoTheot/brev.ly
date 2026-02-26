import { Download } from "lucide-react";
import { List } from "./list";
import { useLinkStore } from "../../../../store/useLinks";

export function GetLinks() {
  const { downloadCsv } = useLinkStore();
  return (
    <div
      className="md:col-span-7 bg-gray-50 rounded-md p-4 sm:p-6 shadow-sm"
    >
      <div className="flex flex-row justify-between items-center pb-4 sm:pb-6">
        <h1>Meus Links</h1>

        <button 
          onClick={() => downloadCsv()}
          className="cursor-pointer flex flex-row items-center gap-1 bg-gray-200 text-gray-600 text-sm rounded-md p-1.5"
        >
          <Download size={14} />
          Baixar CSV
        </button>
      </div>
      
      <List />
    </div>
  )
}