import { useState } from "react";
import { useGithub } from "./components/hooks/useGithub";
import { RepoCard } from "./components/RepoCard";
import { Search, MapPin, Users, Building2, ExternalLink } from "lucide-react";
import { Card } from "../../components/ui/Card";

export const Github = () => {
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState("Rohitdubey-tech");
  const { user, repos } = useGithub(username);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
    }
  };

  return (
    <div className="space-y-6 fade-in max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">GitHub Explorer</h1>
           <p className="text-slate-500 dark:text-slate-400">Search and explore developer profiles.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="GitHub username..." 
               value={searchInput}
               onChange={(e) => setSearchInput(e.target.value)}
               className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 ring-teal-500/50 dark:text-white dark:placeholder-slate-500 shadow-sm w-full md:w-64 transition-all"
             />
          </div>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            Search
          </button>
        </form>
      </div>

      {/* States handling */}
      {user.isLoading ? (
         <div className="animate-pulse space-y-6">
           <div className="h-48 bg-slate-200 dark:bg-[#121826] rounded-2xl"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-slate-200 dark:bg-[#121826] rounded-2xl"></div>
              <div className="h-32 bg-slate-200 dark:bg-[#121826] rounded-2xl"></div>
           </div>
         </div>
      ) : user.isError ? (
         <Card className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">User not found</h3>
            <p className="text-slate-500 dark:text-slate-400">We couldn't find anyone with the username "{username}".</p>
         </Card>
      ) : user.data ? (
        <>
          {/* Profile Summary */}
          <Card className="relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
             <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
               <img src={user.data.avatar_url} alt={user.data.login} className="w-24 h-24 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10" />
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.data.name || user.data.login}</h2>
                      <a href={user.data.html_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 text-sm font-medium mt-1">
                        @{user.data.login} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                 </div>
                 {user.data.bio && (
                   <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-2xl">{user.data.bio}</p>
                 )}
                 <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{user.data.followers}</span> followers
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{user.data.following}</span> following
                    </div>
                    {user.data.location && (
                      <>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 bg-transparent" />
                          {user.data.location}
                        </div>
                      </>
                    )}
                    {user.data.company && (
                      <>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4 bg-transparent" />
                          {user.data.company}
                        </div>
                      </>
                    )}
                 </div>
               </div>
             </div>
          </Card>

          {/* Repositories */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Public Repositories <span className="text-sm font-normal text-slate-500 px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded-full ml-2">{user.data.public_repos}</span></h3>
            {repos.isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-[#121826] rounded-2xl animate-pulse"></div>)}
               </div>
            ) : repos.data?.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {repos.data.map((repo) => (
                   <RepoCard key={repo.id} repo={repo} />
                 ))}
               </div>
            ) : (
               <Card className="text-center py-8">
                 <p className="text-slate-500">No public repositories found.</p>
               </Card>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};