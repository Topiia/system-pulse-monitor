import asyncio
import json
import psutil
import websockets
import time


class SystemMonitor:
    def __init__(self):
        self.procs = {} # PID -> Process object match

    def get_stats(self):
        try:
            # Update Process List
            # We iterate all PIDs to discover new ones and update existing
            current_pids = set()
            for proc in psutil.process_iter(['pid', 'name', 'username']):
                pid = proc.info['pid']
                current_pids.add(pid)
                if pid not in self.procs:
                    self.procs[pid] = proc
                    # Initialize CPU percent (returns 0.0 first time)
                    try:
                        proc.cpu_percent()
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        pass

            # Prune dead processes
            # Use list(keys) to avoid runtime error during deletion
            for pid in list(self.procs.keys()):
                if pid not in current_pids:
                    del self.procs[pid]

            # Collect Stats
            process_stats = []
            for pid, proc in self.procs.items():
                try:
                    # Polling
                    with proc.oneshot():
                        cpu = proc.cpu_percent()
                        # Divide by logical CPUs to match Task Manager style (optional, but 100% = 1 core otherwise)
                        # psutil returns 100% * number of cores potentially. 
                        # User usually expects normalized or raw. Process explorer uses raw (can go > 100%).
                        # Let's keep raw for "Sci-Fi" big numbers, or normalize?
                        # Let's stick to raw psutil output for now.
                        mem = proc.memory_percent()
                        name = proc.name()
                        
                        if cpu > 0.1 or mem > 0.1: # Filter idle
                            process_stats.append({
                                "pid": pid,
                                "name": name,
                                "cpu": round(cpu, 1),
                                "ram": round(mem, 1)
                            })
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    pass
            
            # Sort Top 5 by CPU
            top_processes = sorted(process_stats, key=lambda x: x['cpu'], reverse=True)[:5]

            # General Stats
            cpu_usage = psutil.cpu_percent(interval=None)
            cpu_cores = psutil.cpu_percent(interval=None, percpu=True)
            cpu_freq = psutil.cpu_freq().current if psutil.cpu_freq() else 0
            
            ram = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            net = psutil.net_io_counters()
            battery = psutil.sensors_battery()

            return {
                "cpu_usage": cpu_usage,
                "cpu_cores": cpu_cores,
                "cpu_freq": cpu_freq,
                "ram_total": ram.total,
                "ram_used": ram.used,
                "ram_percent": ram.percent,
                "disk_usage_percent": disk.percent,
                "network": {
                    "bytes_sent": net.bytes_sent,
                    "bytes_recv": net.bytes_recv
                },
                "battery_percent": battery.percent if battery else None,
                "is_plugged_in": battery.power_plugged if battery else True,
                "processes": top_processes,
                "timestamp": time.time()
            }
        except Exception as e:
            print(f"Error gathering stats: {e}")
            return None

monitor = SystemMonitor()

async def broadcast(websocket):
    """Broadcasts system stats to a connected client."""
    print(f"Client connected: {websocket.remote_address}")
    try:
        while True:
            stats = monitor.get_stats()
            if stats:
                await websocket.send(json.dumps(stats))
            await asyncio.sleep(1)
    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected: {websocket.remote_address}")
    except Exception as e:
        print(f"Error in broadcast loop: {e}")

async def main():
    print("Starting System Pulse Server on ws://localhost:8765...")
    async with websockets.serve(broadcast, "localhost", 8765):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server stopped.")
