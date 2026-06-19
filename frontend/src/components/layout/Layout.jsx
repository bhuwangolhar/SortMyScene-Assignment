function Layout({ children }) {
    return (
        <div className="min-h-screen">

            <header className="bg-white border-b">

                <div className="max-w-7xl mx-auto px-6 py-4">

                    <h1 className="text-2xl font-bold text-indigo-600">
                        SortMyScene
                    </h1>

                </div>

            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>

        </div>
    );
}

export default Layout;