import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { AppShell } from '@/components/AppShell';
import Overview from '@/pages/Overview';
import Monitoring from '@/pages/Monitoring';
import DataExplorer from '@/pages/DataExplorer';
import Analysis from '@/pages/Analysis';
import Methodology from '@/pages/Methodology';
import ThreeExplorer from '@/pages/ThreeExplorer';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <AppShell>
        <Switch>
          <Route path="/" component={() => <Redirect to="/overview" />} />
          <Route path="/overview" component={Overview} />
          <Route path="/3d-explorer" component={ThreeExplorer} />
          <Route path="/monitoring" component={Monitoring} />
          <Route path="/data-explorer" component={DataExplorer} />
          <Route path="/analysis" component={Analysis} />
          <Route path="/methodology" component={Methodology} />
          <Route component={NotFound} />
        </Switch>
      </AppShell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
