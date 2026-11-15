import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SectionPage } from '@/pages/SectionPage'

// Admin is code-split: public visitors never download it.
const admin = () => import('@/pages/admin')

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'guides/:section', element: <SectionPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    lazy: async () => ({ Component: (await admin()).AdminRoot }),
    children: [
      { path: 'login', lazy: async () => ({ Component: (await admin()).LoginPage }) },
      {
        lazy: async () => ({ Component: (await admin()).AdminLayout }),
        children: [
          { index: true, lazy: async () => ({ Component: (await admin()).AdminDashboard }) },
          { path: ':section', lazy: async () => ({ Component: (await admin()).AdminCollectionPage }) },
        ],
      },
    ],
  },
])
