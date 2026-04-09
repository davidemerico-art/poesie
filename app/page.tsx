import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      
      <main className="flex flex-col items-center text-center gap-8 p-10 max-w-2xl">
        
        {/* Titolo */}
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Poetry AI
        </h1>

        {/* Descrizione */}
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Scrivi le tue poesie, scegli una categoria come amore o nostalgia,
          e scopri automaticamente le figure retoriche e il significato.
        </p>

        {/* Bottoni */}
        <div className="flex gap-4 mt-4">
          
          <Link href="/login">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="px-6 py-3 border border-purple-600 text-purple-600 rounded-xl hover:bg-purple-100 dark:hover:bg-zinc-800 transition">
              Registrati
            </button>
          </Link>

        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
            <h3 className="font-semibold">Scrivi</h3>
            <p className="text-sm text-zinc-500">
              Crea poesie nelle categorie che preferisci
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
            <h3 className="font-semibold">Analizza</h3>
            <p className="text-sm text-zinc-500">
              Scopri figure retoriche automaticamente
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
            <h3 className="font-semibold"> Significato</h3>
            <p className="text-sm text-zinc-500">
              Ottieni una spiegazione della tua poesia
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}