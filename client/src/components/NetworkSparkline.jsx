import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const NetworkSparkline = ({ sent, recv }) => {
    const [data, setData] = useState(Array(60).fill({ sent: 0, recv: 0 }));

    useEffect(() => {
        setData(prev => {
            const newData = [...prev.slice(1), { sent, recv }];
            return newData;
        });
    }, [sent, recv]);

    // Format bytes to KB/MB
    const formatSpeed = (bytes) => {
        if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / 1024).toFixed(1) + ' KB';
    };

    // Create relative speed (approximate/fake rate for MVP if we just get total counters)
    // Note: The backend sends TOTAL bytes. We need to calculate the delta here for "speed".
    // Actually, let's process the delta in the parent or here. 
    // For simplicity, let's assume the passed `sent` and `recv` are RATES (handled by parent or backend).
    // Wait, I implemented the backend to send TOTAL counters.
    // So I should calculate delta here.

    const [lastValues, setLastValues] = useState({ sent: 0, recv: 0 });
    const [rates, setRates] = useState({ up: 0, down: 0 });

    useEffect(() => {
        if (lastValues.sent === 0 && lastValues.recv === 0) {
            setLastValues({ sent, recv });
            return;
        }
        const up = sent - lastValues.sent;
        const down = recv - lastValues.recv;

        // Filter out negative values if reset
        const safeUp = up >= 0 ? up : 0;
        const safeDown = down >= 0 ? down : 0;

        setRates({ up: safeUp, down: safeDown });
        setLastValues({ sent, recv });

        // Update chart data with RATES, not totals
        setData(prev => [...prev.slice(1), { sent: safeUp, recv: safeDown }]);
    }, [sent, recv]);


    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between mb-2">
                <div className="flex flex-col">
                    <span className="text-xs text-emerald-400 font-mono">⬇ {formatSpeed(rates.down)}/s</span>
                    <span className="text-xs text-sky-400 font-mono">⬆ {formatSpeed(rates.up)}/s</span>
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">Network I/O</div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Area type="monotone" dataKey="recv" stroke="#34d399" fillOpacity={1} fill="url(#colorDown)" strokeWidth={2} isAnimationActive={false} />
                        <Area type="monotone" dataKey="sent" stroke="#38bdf8" fillOpacity={1} fill="url(#colorUp)" strokeWidth={2} isAnimationActive={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default NetworkSparkline;
