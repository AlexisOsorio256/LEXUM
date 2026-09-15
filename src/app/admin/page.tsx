import { redirect } from "next/navigation";

/** Alias: /admin redirige al menú ADMINISTRADOR. */
export default function AdminAlias() {
  redirect("/administrador");
}
