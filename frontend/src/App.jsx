import { Fragment } from "react";
import { EntypoSprite } from "@entypo-icons/react";
import { Routes, Route } from "react-router-dom";
import routes from "@/routes.jsx";
import Layouts from "@/layouts/Layouts.jsx";
import { DashboardDataProvider } from "@/context/dashboardDataContext.jsx";
import { LoadingProvider } from "@/context/LoadingContext"; // Importa o LoadingProvider
import LoadingSpinner from "@/components/LoadingSpinner"; // Importa o componente de carregamento
import PrivateRoute from "@/components/PrivateRoute"; // Importa o componente de rotas privadas
import 'react-toastify/dist/ReactToastify.css'; // Importando o CSS
import { ToastContainer } from 'react-toastify'; // Importa o ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importando o CSS

function App() {
    return (
        <LoadingProvider>
            <div className="app-container position-relative">
                <LoadingSpinner /> {/* Adiciona o spinner de carregamento */}
                <div className="admin-container position-relative overflow-hidden">
                    <DashboardDataProvider>
                        <EntypoSprite />
                        <Routes>
                            {routes?.map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        {item?.path && (
                                            <Route path="/" element={<Layouts />}>
                                                <Route
                                                    path={item?.path}
                                                    element={
                                                        item.private ? (
                                                            <PrivateRoute>
                                                                <item.component />
                                                            </PrivateRoute>
                                                        ) : (
                                                            <item.component />
                                                        )
                                                    }
                                                />
                                            </Route>
                                        )}
                                        {item?.route && (
                                            <Route
                                                path={item?.route}
                                                element={
                                                    item.private ? (
                                                        <PrivateRoute>
                                                            <item.component />
                                                        </PrivateRoute>
                                                    ) : (
                                                        <item.component />
                                                    )
                                                }
                                            />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </Routes>
                    </DashboardDataProvider>
                </div>
            </div>
            <ToastContainer />
        </LoadingProvider>
    );
}

export default App;

