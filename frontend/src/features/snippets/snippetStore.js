import { create } from "zustand";
import { api } from "../../services/api";
import { useNotificationStore } from "../../app/notificationStore";

export const useSnippetStore = create((set, get) => ({
  snippets: [],
  stats: { total: 0, favorites: 0, languages: [], tags: [] },
  searchQuery: "",
  activeTag: null,
  selectedLanguage: null,
  isLoading: false,
  error: null,

  // Fetch snippets from backend
  fetchSnippets: async () => {
    set({ isLoading: true, error: null });
    try {
      const { searchQuery, activeTag, selectedLanguage } = get();
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (activeTag) params.append("tag", activeTag);
      if (selectedLanguage) params.append("language", selectedLanguage);

      const { data } = await api.get(`/snippets?${params.toString()}`);
      set({
        snippets: data.data.snippets,
        stats: data.data.stats,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch snippets", isLoading: false });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    // Debounced fetch will be handled by the component
  },

  setActiveTag: (tag) => {
    set((state) => ({ activeTag: state.activeTag === tag ? null : tag }));
  },

  setSelectedLanguage: (lang) => {
    set((state) => ({ selectedLanguage: state.selectedLanguage === lang ? null : lang }));
  },

  // Add snippet
  addSnippet: async (snippet) => {
    set({ error: null });
    try {
      const { data } = await api.post("/snippets", snippet);
      set((state) => ({
        snippets: [data.data.snippet, ...state.snippets],
      }));
      useNotificationStore.getState().addNotification("snippet", "Snippet Saved", `"${snippet.title}" saved to your vault.`);
      // Refresh stats and full list to ensure filters stay in sync
      get().fetchSnippets();
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to create snippet" });
      return false;
    }
  },

  // Delete snippet
  deleteSnippet: async (id) => {
    set((state) => ({
      snippets: state.snippets.filter((s) => s._id !== id),
    }));
    try {
      await api.delete(`/snippets/${id}`);
    } catch (err) {
      get().fetchSnippets();
      set({ error: err.response?.data?.message || "Failed to delete snippet" });
    }
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    // Optimistic update
    set((state) => ({
      snippets: state.snippets.map((s) =>
        s._id === id ? { ...s, isFavorite: !s.isFavorite } : s
      ),
    }));
    try {
      await api.patch(`/snippets/${id}/favorite`);
    } catch (err) {
      get().fetchSnippets();
    }
  },

  // Derived getters 
  getFilteredSnippets: () => {
    const { snippets, searchQuery, activeTag, selectedLanguage } = get();
    return snippets.filter((s) => {
      const matchesSearch = !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !activeTag || s.tags.includes(activeTag);
      const matchesLang = !selectedLanguage || s.language === selectedLanguage;
      return matchesSearch && matchesTag && matchesLang;
    });
  },

  getAllTags: () => get().stats.tags || [],
  getAllLanguages: () => get().stats.languages || [],
}));
