import { useState, useEffect } from "react";
import { useGithub } from "./components/hooks/useGithub";
import { RepoCard } from "./components/RepoCard";
import { Search, MapPin, Users, Building2, ExternalLink } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useAuthStore } from "../auth/authStore";

export const Github = () => {
  const { user: authUser } = useAuthStore();
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState(authUser?.githubUsername || "Rohitdubey-tech");
  const { user, repos, isLoading, isError } = useGithub(username);

  // Real-time debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        setUsername(searchInput.trim());
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
    }
  };

  return (
    <div className="space-y-6 fade-in max-w-5xl mx-auto pb-12">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">GitHub Explorer</h1>
           <p className="text-slate-500 dark:text-slate-400">Deep dive into any developer's public identity.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="GitHub username..." 
               value={searchInput}
               onChange={(e) => setSearchInput(e.target.value)}
               className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 ring-teal-500/50 dark:text-white dark:placeholder-slate-500 shadow-sm w-full md:w-64 transition-all"
             />
          </div>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-teal-500/20 active:scale-95">
            Search
          </button>
        </form>
      </div>

      {/* States handling */}
      {isLoading ? (
         <div className="animate-pulse space-y-6">
           <div className="h-48 bg-slate-100 dark:bg-white/5 rounded-2xl"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-white/5 rounded-2xl"></div>)}
           </div>
         </div>
      ) : isError ? (
         <Card className="flex flex-col items-center justify-center py-12 text-center border-rose-500/20">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Search Failed</h3>
            <p className="text-slate-500 dark:text-slate-400">Username "{username}" not found or API rate limited.</p>
         </Card>
      ) : user ? (
        <>
          {/* Profile Summary */}
          <Card className="relative overflow-hidden border-teal-500/20">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
             <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
               <img src={user.avatar_url} alt={user.login} className="w-24 h-24 rounded-2xl shadow-xl border-2 border-white dark:border-white/10" />
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.name || user.login}</h2>
                      <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 text-sm font-bold mt-0.5">
                        @{user.login} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                 </div>
                 {user.bio && (
                   <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-2xl text-sm leading-relaxed">{user.bio}</p>
                 )}
                 <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-slate-900 dark:text-slate-200">{user.followers}</span> followers
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-900 dark:text-slate-200">{user.following}</span> following
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {user.location}
                      </div>
                    )}
                    {user.company && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {user.company}
                      </div>
                    )}
                 </div>
               </div>
             </div>
          </Card>

          {/* Repositories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Public Projects</h3>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full border border-slate-200 dark:border-white/5">
                {user.public_repos} TOTAL
              </span>
            </div>
            {repos.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {repos.map((repo) => (
                   <RepoCard key={repo.id} repo={repo} />
                 ))}
               </div>
            ) : (
               <Card className="text-center py-12 bg-slate-50/50 dark:bg-white/[0.01] border-dashed">
                 <p className="text-slate-500 text-sm italic">No public repositories found for this account.</p>
               </Card>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};