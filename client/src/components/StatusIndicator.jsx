import { motion } from 'framer-motion';

const StatusIndicator = ({ isConnected }) => {
    return (
        <div className="flex items-center space-x-2 bg-slate-900/50 rounded-full px-3 py-1 border border-white/5">
            <div className="relative flex h-3 w-3">
                {isConnected && (
                    <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inline-flex h-full w-full rounded-full bg-electric-blue opacity-75"
                    />
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-electric-blue' : 'bg-slate-500'}`}></span>
            </div>
            <span className={`text-xs font-mono font-bold ${isConnected ? 'text-electric-blue' : 'text-slate-500'}`}>
                {isConnected ? 'SYSTEM ONLINE' : 'OFFLINE'}
            </span>
        </div>
    );
};

export default StatusIndicator;
