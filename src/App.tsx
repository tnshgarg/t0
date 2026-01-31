import { TimeEngineProvider } from './context/TimeEngine'
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
      <SplitViewProvider>
        <Layout>
          <CanvasRouter />
        </Layout>
      </SplitViewProvider>
    </TimeEngineProvider>
  )
}

export default App
