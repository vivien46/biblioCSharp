import React, { useEffect, useState } from "react";
import { getStats } from "../../Api/books";

interface Stats {
    totalBooks: number;
    totalAuteurs: number;
    totalEmprunts: number;
}

const StatsBar: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (err) {
                // Si les stats échouent, on masque simplement le bandeau
                setStats(null);
            }
        };

        fetchStats();
    }, []);

    if (!stats) {
        return null;
    }

    return (
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            <div className="bg-white shadow-md rounded p-4 text-center">
                <p className="text-2xl font-bold text-blue-500">{stats.totalBooks}</p>
                <p className="text-sm text-gray-600">Livres</p>
            </div>
            <div className="bg-white shadow-md rounded p-4 text-center">
                <p className="text-2xl font-bold text-blue-500">{stats.totalAuteurs}</p>
                <p className="text-sm text-gray-600">Auteurs</p>
            </div>
            <div className="bg-white shadow-md rounded p-4 text-center">
                <p className="text-2xl font-bold text-blue-500">{stats.totalEmprunts}</p>
                <p className="text-sm text-gray-600">Emprunts en cours</p>
            </div>
        </div>
    );
};

export default StatsBar;