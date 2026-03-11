import { TemplatePanel } from './components/Editor/TemplatePanel';
import { PreviewArea } from './components/Editor/PreviewArea';
import { StylePanel } from './components/Editor/StylePanel';
import { ExportButton } from './components/Editor/ExportButton';

function App() {
  return (
    <div className="app-shell min-h-screen">
      <header className="flex min-h-[76px] items-center justify-between border-b border-slate-200/70 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <img
            className="brand-mark h-11 w-11 rounded-2xl"
            src="/logo.svg"
            alt="简单卡片（JIANDAN CARD）"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">
              JIANDAN CARD
            </p>
            <h1 className="text-xl font-semibold text-slate-950">简单卡片</h1>
          </div>
        </div>
        <ExportButton />
      </header>

      <div className="flex flex-1 min-h-0 flex-col xl:flex-row">
        <aside className="shrink-0 border-b border-slate-200/70 xl:w-[360px] xl:border-b-0 xl:border-r">
          <TemplatePanel />
        </aside>

        <main className="flex min-h-[420px] flex-1 overflow-hidden xl:min-h-0">
          <PreviewArea />
        </main>

        <aside className="shrink-0 xl:w-[340px]">
          <StylePanel />
        </aside>
      </div>
    </div>
  );
}

export default App;
