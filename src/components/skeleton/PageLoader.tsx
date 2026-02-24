export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">

      {/* Ícone prato */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full border-4 border-muted border-t-primary animate-spin" />

        {/* centro do prato */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-muted/40" />
        </div>
      </div>
      
    </div>
  )
}