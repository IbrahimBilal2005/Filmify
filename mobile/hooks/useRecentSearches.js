import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';

const API_BASE = 'http://10.0.0.130:3000';

export const useRecentSearches = () => {
    const [recent, setRecent] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data?.session?.user ?? null);
        };
        getUser();
    }, []);

    const fetchRecent = useCallback(async () => {
        if (!user) return setRecent([]);
        setLoading(true);
        try {
            const url = `${API_BASE}/users/${user.id}/recent-search`;
            const res = await fetch(url);
            
            if (!res.ok) {
                return;
            }

            const contentType = res.headers.get('content-type');
            
            if (!contentType || !contentType.includes('application/json')) {
                return;
            }

            const data = await res.json();
            setRecent(data);
        } catch (err) {
            console.error('Failed to load recent searches:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const saveSearch = useCallback(async (movieId) => {
        if (!user) {
            return;
        }

        try {
            const url = `${API_BASE}/users/${user.id}/recent-search`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, movieId }),
            });
            
            if (!res.ok) {
                return;
            }

            const result = await res.json();
        } catch (err) {
            console.error('Failed to save recent search:', err);
        }
    }, [user]);

    useEffect(() => {
        if (user) fetchRecent();
    }, [user, fetchRecent]);

    return {
        recent,
        loading,
        user,
        saveSearch,
        refreshRecent: fetchRecent,
    };
};