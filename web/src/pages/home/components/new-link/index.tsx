import { Form } from "./form";

export function NewLink() {
  return (
    <div
      className="md:col-span-5 bg-gray-50 p-6 rounded-md shadow-sm"
    >
      <h1 className="pb-6">Novo link</h1>
      <Form />
    </div>
  )
}