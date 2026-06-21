import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layout/Layout";
import { SidebarProvider } from "./context/SidebarContext";

function App() {

    return (
        <SidebarProvider>
            <Layout>
                <AppRoutes />
            </Layout>
        </SidebarProvider>
    );
}

export default App;