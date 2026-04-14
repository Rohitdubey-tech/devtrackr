import { Card } from "../../../components/ui/Card";
import { Star, GitFork, BookOpen } from "lucide-react";

export const RepoCard = ({ repo }) => {
  return (
    <Card className="hover:-translate-y-1 hover:shadow-teal-500/10 group cursor-pointer transition-all duration-300 flex flex-col h-full bg-white/60 dark:bg-[#0f1420]/60">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0 border border-teal-500/20">
           <BookOpen className="w-5 h-5" />
        </div>
        <div>
           <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-slate-800 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 truncate block max-w-full">
             {repo.name}
           </a>
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
             {repo.description || "No description provided."}
           </p>
        </div>
      </div>
      
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
           {repo.language && (
             <span className="flex items-center gap-1">
               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
               {repo.language}
             </span>
           )}
           <span className="flex items-center gap-1 group-hover:text-teal-500 transition-colors">
             <Star className="w-3.5 h-3.5" />
             {repo.stargazers_count}
           </span>
           <span className="flex items-center gap-1">
             <GitFork className="w-3.5 h-3.5" />
             {repo.forks_count}
           </span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
          {repo.visibility}
        </span>
      </div>
    </Card>
  );
};