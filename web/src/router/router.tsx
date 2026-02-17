import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home";
import { Redirect } from "../pages/redirect";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/redirect/:shortUrl" element={<Redirect />}/>
    </Routes>
  )
}