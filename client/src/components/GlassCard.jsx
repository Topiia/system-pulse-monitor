import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', title, alert = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: alert ? '0 0 20px rgba(255, 0, 60, 0.3)' : '0 0 20px rgba(0, 243, 255, 0.2)' }}
            className={`glass-panel rounded-2xl p-6 relative overflow-hidden text-slate-200 transition-all flex flex-col ${className} ${alert ? 'border-crimson-red shadow-neon-red' : 'border-glass-border'}`}
        >
            {alert && <div className="absolute inset-0 bg-crimson-red/10 animate-pulse pointer-events-none" />}
            {title && <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-mono shrink-0">{title}</h3>}
            {children}
        </motion.div>
    );
};

export default GlassCard;
