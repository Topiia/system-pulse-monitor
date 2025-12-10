import { motion } from 'framer-motion';

const ProcessTable = ({ processes = [] }) => {
    return (
        <div className="w-full h-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-12 text-xs font-mono text-slate-500 pb-2 border-b border-white/5 uppercase tracking-wider">
                <div className="col-span-6">Name</div>
                <div className="col-span-3 text-right">CPU%</div>
                <div className="col-span-3 text-right">RAM%</div>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto mt-2 space-y-1 scrollbar-hide">
                {processes.length === 0 && (
                    <div className="text-center text-slate-600 text-sm py-4 italic">Scanning processes...</div>
                )}

                {processes.map((proc, index) => (
                    <motion.div
                        key={proc.pid}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-12 text-sm items-center hover:bg-white/5 p-1 rounded transition-colors"
                    >
                        <div className="col-span-6 truncate font-medium text-slate-300" title={proc.name}>
                            {proc.name}
                            <span className="text-[10px] text-slate-600 block">{proc.pid}</span>
                        </div>

                        <div className="col-span-3 text-right font-mono text-electric-blue">
                            {proc.cpu.toFixed(1)}
                        </div>

                        <div className="col-span-3 text-right font-mono text-emerald-400">
                            {proc.ram.toFixed(1)}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProcessTable;
