const MemoryBlock = ({ total, used, percent }) => {
    // Convert bytes to GB
    const totalGB = (total / (1024 ** 3)).toFixed(1);
    const usedGB = (used / (1024 ** 3)).toFixed(1);

    // Create visual blocks (e.g., 20 blocks representing 100%)
    const totalBlocks = 20;
    const activeBlocks = Math.round((percent / 100) * totalBlocks);

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <div className="text-3xl font-bold text-slate-100 font-mono">{percent}%</div>
                    <div className="text-xs text-slate-400">MEMORY LOAD</div>
                </div>
                <div className="text-right">
                    <div className="text-lg text-electric-blue font-mono">{usedGB} GB</div>
                    <div className="text-xs text-slate-500">of {totalGB} GB</div>
                </div>
            </div>

            <div className="flex gap-1 h-12">
                {Array.from({ length: totalBlocks }).map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 rounded-sm transition-all duration-300 ${i < activeBlocks
                                ? 'bg-electric-blue shadow-[0_0_8px_rgba(0,243,255,0.4)]'
                                : 'bg-slate-800'
                            }`}
                    />
                ))}
            </div>

            <div className="mt-4 flex justify-between text-xs text-slate-500 font-mono">
                <span>0 GB</span>
                <span>{(totalGB / 2).toFixed(0)} GB</span>
                <span>{totalGB} GB</span>
            </div>
        </div>
    );
};

export default MemoryBlock;
