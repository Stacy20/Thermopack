import { Routes, Route, Navigate } from 'react-router-dom'
import { ClientLayout } from './pages/ClientLayout'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { ServicesPage } from './pages/ServicesPage'
import { ContactPage } from './pages/ContactPage'
import { DetailPage } from './pages/DetailPage'
import { NosotrosPage } from './pages/NosotrosPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminConfigHomePage } from './pages/admin/AdminConfigHomePage'
import { AdminConfigContactPage } from './pages/admin/AdminConfigContactPage'
import { AdminConfigNosotrosPage } from './pages/admin/AdminConfigNosotrosPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminServicesPage } from './pages/admin/AdminServicesPage'
import { AddProductPage } from './pages/admin/AddProductPage'
import { EditProductPage } from './pages/admin/EditProductPage'
import { AddServicePage } from './pages/admin/AddServicePage'
import { EditServicePage } from './pages/admin/EditServicePage'
import { UsersPage } from './pages/admin/UsersPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Navigate to="inicio" replace />} />
        <Route path="inicio" element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="servicios" element={<ServicesPage />} />
        <Route path="contactenos" element={<ContactPage />} />
        <Route path="nosotros" element={<NosotrosPage />} />
        <Route path="detalles/:type/:id" element={<DetailPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="config/home" replace />} />
        <Route path="config">
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminConfigHomePage />} />
          <Route path="contact" element={<AdminConfigContactPage />} />
          <Route path="nosotros" element={<AdminConfigNosotrosPage />} />
        </Route>
        <Route path="products">
          <Route index element={<AdminProductsPage />} />
          <Route path="add" element={<AddProductPage />} />
          <Route path="edit/:id" element={<EditProductPage />} />
        </Route>
        <Route path="services">
          <Route index element={<AdminServicesPage />} />
          <Route path="add" element={<AddServicePage />} />
          <Route path="edit/:id" element={<EditServicePage />} />
        </Route>
        <Route path="users" element={<UsersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
