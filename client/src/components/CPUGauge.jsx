import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const CPUGauge = ({ usage, freq, cores = [] }) => {
    const data = [
        { name: 'Used', value: usage },
        { name: 'Free', value: 100 - usage },
    ];

    let color = '#00f3ff'; // Electric Blue
    if (usage > 50) color = '#ffbc0e'; // Amber
    if (usage > 80) color = '#ff003c'; // Crimson Red

    return (
        <div className="flex flex-col items-center justify-center h-full relative group">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold font-mono transition-colors duration-300" style={{ color }}>{usage}%</span>
                <span className="text-xs text-slate-400 mt-1">{freq} GHz</span>
            </div>

            <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={180}
                            endAngle={0}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                        >
                            <Cell key="cell-used" fill={color} />
                            <Cell key="cell-free" fill="#1e293b" />
                        </Pie>
                        <Tooltip
                            cursor={false}
                            content={() => null} // Custom tooltip handled via hover on parent overlay if needed, or default off
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Core Breakdown Mini-view */}
            <div className="grid grid-cols-4 gap-1 mt-4 w-full">
                {cores.slice(0, 16).map((core, i) => (
                    <div key={i} className="h-1 bg-slate-800 rounded-full overflow-hidden" title={`Core ${i}: ${core}%`}>
                        <div
                            className="h-full transition-all duration-300"
                            style={{ width: `${core}%`, backgroundColor: core > 80 ? '#ff003c' : '#00f3ff' }}
                        />
                    </div>
                ))}
            </div>

            {/* Tooltip Overlay */}
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur text-xs p-2 rounded border border-white/10 pointer-events-none">
                {freq} GHz
            </div>
        </div>
    );
};

export default CPUGauge;
