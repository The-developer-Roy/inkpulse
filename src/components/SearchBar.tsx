"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(query.trim().toLowerCase());
        }, 300); // debounce

        return () => clearTimeout(timeout);
    }, [query, onSearch]);

    return (
        <div className="flex items-center w-full max-w-md mx-auto bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 ring-blue-500 transition-all">
            <Search className="w-5 h-5 text-gray-500" />
            <input
                type="text"
                placeholder="Search by title or tag..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
            {query && (
                <button onClick={() => setQuery("")} className="ml-2 text-gray-400 hover:text-red-500 transition">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
