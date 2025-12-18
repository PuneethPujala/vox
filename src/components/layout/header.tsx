export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <h1 className="text-2xl font-bold">Vox</h1>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium hover:underline">
            Home
          </a>
          <a href="/vendor-dashboard" className="text-sm font-medium hover:underline">
            Vendor Dashboard
          </a>
          <a href="/product-management" className="text-sm font-medium hover:underline">
            Products
          </a>
          <a href="/admin/vendor-verification" className="text-sm font-medium hover:underline">
            Admin
          </a>
        </nav>
      </div>
    </header>
  );
}
