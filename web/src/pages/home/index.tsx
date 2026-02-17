
import { NewLink } from "./components/new-link";
import { GetLinks } from "./components/links";

import Logo from "../../assets/logo.svg";

export function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full">
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pt-32">
        <div className="w-full">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <NewLink />
          <GetLinks />
        </div>
      </div>
    </main>
  )
}