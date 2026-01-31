import { TimeEngineProvider } from './context/TimeEngine'
import { UIProvider } from './context/UIContext'
import { SplitViewProvider, useSplitView } from './context/SplitViewContext'
import { Layout } from './components/ui/Layout'
import { EarthCanvas } from './components/EarthCanvas'
import { SplitEarthCanvas } from './components/SplitEarthCanvas'

const CanvasRouter = () => {
  const { isSplitView } = useSplitView();
  return isSplitView ? <SplitEarthCanvas /> : <EarthCanvas />;
};

function App() {
  return (
    <TimeEngineProvider>
      <UIProvider>
        <SplitViewProvider>
          <Layout>
            <CanvasRouter />
          </Layout>
        </SplitViewProvider>
      </UIProvider>
    </TimeEngineProvider>
  )
}

export default App
