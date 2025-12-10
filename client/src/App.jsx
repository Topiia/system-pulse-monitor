import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Wifi, Zap } from 'lucide-react';
import CPUGauge from './components/CPUGauge';
import GlassCard from './components/GlassCard';
import MemoryBlock from './components/MemoryBlock';
import NetworkSparkline from './components/NetworkSparkline';
import ProcessTable from './components/ProcessTable';
import StatusIndicator from './components/StatusIndicator';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const { data, isConnected } = useWebSocket();

  // Default / Empty state to prevent crash before first data arrives
  const stats = data || {
    cpu_usage: 0,
    cpu_cores: [],
    cpu_freq: 0,
    ram_total: 0,
    ram_used: 0,
    ram_percent: 0,
    disk_usage_percent: 0,
    network: { bytes_sent: 0, bytes_recv: 0 },
    battery_percent: null,
    is_plugged_in: true,
    processes: []
  };

  const isCpuCritical = stats.cpu_usage > 90;

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 font-sans selection:bg-electric-blue selection:text-black">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic flex items-center gap-2">
            <Activity className="text-electric-blue w-8 h-8" />
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-purple-500">Pulse</span>
          </h1>
          <p className="text-slate-500 text-sm tracking-widest mt-1">REAL-TIME HARDWARE MONITORING</p>
        </div>
        <StatusIndicator isConnected={isConnected} />
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

        {/* CPU Card - Large */}
        <GlassCard
          className="md:col-span-2 row-span-2 min-h-[300px]"
          title="CPU Load"
          alert={isCpuCritical}
        >
          <div className="absolute top-4 right-4 text-electric-blue">
            <Cpu size={24} />
          </div>
          <CPUGauge usage={stats.cpu_usage} freq={stats.cpu_freq} cores={stats.cpu_cores} />
        </GlassCard>

        {/* RAM Card */}
        <GlassCard className="min-h-[240px]" title="Memory">
          <MemoryBlock total={stats.ram_total} used={stats.ram_used} percent={stats.ram_percent} />
        </GlassCard>

        {/* Network Card */}
        <GlassCard className="min-h-[240px]" title="Network I/O">
          <div className="absolute top-4 right-4 text-electric-blue">
            <Wifi size={24} />
          </div>
          <NetworkSparkline sent={stats.network.bytes_sent} recv={stats.network.bytes_recv} />
        </GlassCard>

        {/* Disk Usage */}
        <GlassCard className="min-h-[160px]" title="Storage">
          <div className="flex items-center justify-between h-full pb-6">
            <HardDrive className="text-slate-500 w-12 h-12" />
            <div className="text-right">
              <div className="text-4xl font-bold font-mono text-white">{stats.disk_usage_percent}%</div>
              <div className="text-xs text-slate-400">USED SPACE</div>
            </div>
          </div>
          {/* Simple Disk Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-auto">
            <div
              className="h-full bg-gradient-to-r from-electric-blue to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.disk_usage_percent}%` }}
            />
          </div>
        </GlassCard>

        {/* Battery / Power */}
        <GlassCard className="min-h-[160px]" title="Power">
          <div className="flex flex-col h-full justify-between pb-2">
            <div className="flex justify-between items-start">
              <Zap className={`${stats.is_plugged_in ? 'text-neon-amber' : 'text-slate-600'} w-8 h-8`} />
              <span className="text-xs font-mono text-slate-400">
                {stats.is_plugged_in ? 'AC CONNECTED' : 'BATTERY'}
              </span>
            </div>
            {stats.battery_percent !== null && (
              <div>
                <div className="text-3xl font-bold font-mono">{stats.battery_percent}%</div>
                <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stats.battery_percent < 20 ? 'bg-crimson-red' : 'bg-emerald-400'}`}
                    style={{ width: `${stats.battery_percent}%` }}
                  />
                </div>
              </div>
            )}
            {stats.battery_percent === null && (
              <div className="text-sm text-slate-500">Desktop / No Battery</div>
            )}
          </div>
        </GlassCard>

        {/* Ghost Process Monitor */}
        <GlassCard className="md:col-span-2 min-h-[300px]" title="Top Processes">
          <ProcessTable processes={stats.processes} />
        </GlassCard>

      </div>
    </div>
  );
}

export default App;
