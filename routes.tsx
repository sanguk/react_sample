import React, {
  Suspense,
  Fragment,
  lazy
} from 'react';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import MainLayout from 'src/layouts/MainLayout';
import HomeView from 'src/views/home/HomeView';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';

type Routes = {
  exact?: boolean;
  path?: string | string[];
  guard?: any;
  layout?: any;
  component?: any;
  routes?: Routes;
}[];

export const renderRoutes = (routes: Routes = []): JSX.Element => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes
                    ? renderRoutes(route.routes)
                    : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes: Routes = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    path: '/app',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: '/app/dev/lists',
        component: lazy(() => import('src/views/dev/Lists'))
      },
      {
        exact: true,
        path: '/app/dev/SalesOrder',
        component: lazy(() => import('src/views/dev/SalesOrder'))
      },
      {
        exact: true,
        path: '/app/dev/hyunjoo',
        component: lazy(() => import('src/views/dev/hyunjoo'))
      },
      {
        exact: true,
        path: '/app/dev/SalesOrder/InvoiceEdit',
        component: lazy(() => import('src/views/dev/SalesOrder/InvoiceEdit/index'))
      },
      {
        exact: true,
        path: '/app/dev/sam',
        component: lazy(() => import('src/views/dev/Sam/SamListView'))
      },
      {
        exact: true,
        path: '/app/dev/sam/edit/:id',
        component: lazy(() => import('src/views/dev/Sam/SamEditView'))
      },
      {
        exact: true,
        path: '/app/dev/sam/so/edit/:id',
        component: lazy(() => import('src/views/dev/Sam/SamSOEdit'))
      }, {
        exact: true,
        path: '/app/dev/sam/sh/edit/:id',
        component: lazy(() => import('src/views/dev/Sam/SamShipmentEdit'))
      },
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

export default routes;
