import { useState, useCallback, useEffect } from "react";
import { useSnippetStore } from "./snippetStore";
import { Card } from "../../components/ui/Card";
import {
  Search, Plus, Heart, Trash2, Copy, Check, Code2, X, Tag,
} from "lucide-react";

const SnippetCard = ({ snippet }) => {
  const { deleteSnippet, toggleFavorite } = useSnippetStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [snippet.code]);

  const langColors = {
    javascript: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    python: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    go: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    rust: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    typescript: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  return (
    <Card className="group hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white truncate">{snippet.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${langColors[snippet.language] || "bg-slate-500/10 text-slate-500 border-slate-500/20"}`}>
              {snippet.language}
            </span>
            {snippet.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            onClick={() => toggleFavorite(snippet._id || snippet.id)}
            className={`p-1.5 rounded-lg transition-colors ${snippet.isFavorite ? "text-rose-500 bg-rose-500/10" : "text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"}`}
          >
            <Heart className="w-4 h-4" fill={snippet.isFavorite ? "currentColor" : "none"} />
          </button>
          <button onClick={handleCopy} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={() => deleteSnippet(snippet._id || snippet.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code block */}
      <div className="relative mt-auto">
        <pre className="bg-[#0d1117] text-[#c9d1d9] rounded-xl p-4 text-xs font-mono overflow-x-auto max-h-48 leading-relaxed border border-white/5">
          <code>{snippet.code}</code>
        </pre>
      </div>

      <p className="text-[10px] text-slate-400 mt-3">
        {new Date(snippet.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </Card>
  );
};

const AddSnippetModal = ({ onClose }) => {
  const { addSnippet } = useSnippetStore();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [tags, setTags] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    addSnippet({
      title: title.trim(),
      language,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      code,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#121826] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Snippet</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Quick Sort" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Tags (comma-separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, hooks" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Code</label>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={8} placeholder="Paste your code here..." className="w-full px-3 py-2 rounded-xl bg-[#0d1117] text-[#c9d1d9] font-mono text-xs border border-white/5 outline-none focus:ring-2 ring-emerald-500/50 resize-none" />
          </div>
          <button type="submit" disabled={!title.trim() || !code.trim()} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Save Snippet
          </button>
        </form>
      </div>
    </div>
  );
};

export const Snippets = () => {
  const { searchQuery, setSearchQuery, activeTag, setActiveTag, selectedLanguage, setSelectedLanguage, getFilteredSnippets, getAllTags, getAllLanguages, fetchSnippets } = useSnippetStore();
  const [showModal, setShowModal] = useState(false);

  // Fetch snippets on mount
  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const filteredSnippets = getFilteredSnippets();
  const allTags = getAllTags();
  const allLanguages = getAllLanguages();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Code Snippets</h1>
          <p className="text-slate-500 dark:text-slate-400">Your personal code vault — save, search, and reuse.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
          <Plus className="w-4 h-4" /> New Snippet
        </button>
      </div>

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search snippets by title or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {allLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${selectedLanguage === lang
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        {allTags.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${activeTag === tag
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-white/5"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Snippets Grid */}
      {filteredSnippets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet._id || snippet.id} snippet={snippet} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-500/10 text-slate-500 rounded-full flex items-center justify-center mb-4">
            <Code2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No snippets found</h3>
          <p className="text-sm text-slate-500">Try adjusting your filters or add a new snippet.</p>
        </Card>
      )}

      {showModal && <AddSnippetModal onClose={() => setShowModal(false)} />}
    </div>
  );
};
