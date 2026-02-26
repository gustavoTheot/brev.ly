import { create } from 'zustand';
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";
import { toast } from "sonner";
import { api } from "../http/api";
import type { LinkProps, LinkResponse } from "../dto/link-DTO";
import { downloadUrl } from '../util/download-url';

interface LinkStore {
  links: LinkResponse[];
  createLink: (data: LinkProps) => Promise<void>;
  getAll: () => Promise<LinkResponse[]>;
  remove: (id: string) => Promise<boolean>;
  getOriginUrl: (shortUrl: string) => Promise<string | undefined>;
  downloadCsv: () => Promise<void>;
}

enableMapSet();

export const useLinkStore = create<LinkStore, [["zustand/immer", never]]>(
  immer((set,) => {
    async function createLink(data: LinkProps) {
      try {
        const { originUrl, shortUrl } = data;
        const response = await api.post("/link", { originUrl, shortUrl });

        set(state => {
          state.links.unshift(response.data);
        });
        
        toast.success("Link encurtado criado com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao criar o link encurtado");
      }
    }

    async function getAll(){
      try {
        const response = await api.get("/link");

        set(state => {
          state.links = response.data
        });

        return response.data;
      } catch (error) {
        console.error(error);
      }
    }

    async function remove(id: string) {
      try {
        await api.delete(`/link/${id}`);

        set(state => {
          state.links = state.links.filter(link => link.id !== id);
        });
        return true;
      } catch (error) {
        console.error(error);
        toast.error("Erro ao deletar o link encurtado");
        return false;
      }
    }

    async function getOriginUrl(shortUrl: string) {
      try {
        const response = await api.get(`/redirect/${shortUrl}`);

        return response.data.originalUrl;
      } catch (error) {
        console.error(error);
        toast.error("Erro ao redirecionar para o link original");
      }
    }

    async function downloadCsv() {
      const response = await api.post(`/uploads/export-csv`)

      downloadUrl(response.data.reportUrl)
    }

    return {
      links: [],
      createLink,
      getAll,
      remove,
      getOriginUrl,
      downloadCsv
    }
  })
)