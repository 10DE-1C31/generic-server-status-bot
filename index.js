const { Client, GatewayIntentBits, EmbedBuilder } = require(`discord.js`)
require(`dotenv`).config();
const os = require(`os`);
const si = require(`systeminformation`);

function formatCpuClock(clockSpeed) {
    const avgClock = clockSpeed.avg;
    const maxClock = clockSpeed.max;
    return `Avg. clock:${avgClock.toFixed(4) * 1000} MHz \n Max clock: ${maxClock.toFixed(4) * 1000} MHz \n Min clock: ${clockSpeed.min.toFixed(4) * 1000} MHz`;
}
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

client.on(`messageCreate`, async (message) => {
    if (!message.content.startsWith(`%`)) return;
    if (message.author.bot) return;
    
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!command) return;

    if (command === `stat`) {
        const sub = args.shift()?.toLowerCase();

         if (!sub) {
                const embed = new EmbedBuilder()
                .setTitle(`Error`)
                .setColor(0x0060ff)
                .setDescription(`No argument provided. Use \`%stat -help\` for a list of available arguments.`)
                message.reply({ embeds: [embed] });
            }

            else if (sub === `-cpu`) {
            const cpuTemp = await si.cpuTemperature();
            const clockSpeed = await si.cpuCurrentSpeed();
            const cpuLoad = await si.currentLoad();
            const embed = new EmbedBuilder()
                .setTitle(`CPU stats`)
                .setColor(0x0060ff)
                .addFields(
                    { name: `CPU load`, value: `${cpuLoad.currentLoad.toFixed(2)} %`, inline: true },
                    { name: `CPU clock speed`, value: formatCpuClock(clockSpeed), inline: true },
                    { name: `CPU Temperature`, value: `${cpuTemp.main} °C`, inline: true }
                );
                
            message.reply({embeds: [embed]})
         }

            else if (sub === `-mem`) {
            const memUsageMb = (os.totalmem() / 1e6 - os.freemem() / 1e6).toFixed(0);
            const totalMemMb = (os.totalmem() / 1e6).toFixed(0);
            const embed = new EmbedBuilder()
                .setTitle(`Memory usage`)
                .setColor(0x0060ff)
                .setDescription(`
                 Memory usage: ${memUsageMb} MB / ${totalMemMb} MB   
                `)
            message.reply({embeds: [embed]});
          }
    
         else if (sub === `-uptime`) {
            const uptime = await os.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = (uptime % 60).toFixed(0);
             const embed = new EmbedBuilder()
                .setTitle(`Uptime`)
                .setColor(0x0060ff)
                .setDescription(`Uptime: ${hours}h ${minutes}m ${seconds}s`)
            message.reply({embeds: [embed]});
         }

         else if (sub === '-net') {
             const networkPing = await si.inetLatency();
             const networkStats = await si.networkStats();

             const embed = new EmbedBuilder()
              .setTitle('Network Stats')
             .setColor(0x0060FF)
              .addFields(
                { name: 'Ping', value: `${networkPing} ms`, inline: false }
               );

             for (const iface of networkStats) {
               const rx = (iface.rx_sec / 1e6).toFixed(2);
               const tx = (iface.tx_sec / 1e6).toFixed(2);

              embed.addFields({
                 name: iface.iface,
                 value: `Download: ${rx} MB/s\nUpload: ${tx} MB/s`,
                 inline: true,
               });
            }

            message.reply({ embeds: [embed] });
            }
    
         else if (sub === '-disk') {
          const diskIO = await si.disksIO();
          const lines = [];

             if (diskIO.rIO_sec != null) lines.push(`Read IOPS: ${diskIO.rIO_sec.toFixed(0)}`);
             if (diskIO.wIO_sec != null) lines.push(`Write IOPS: ${diskIO.wIO_sec.toFixed(0)}`);
             if (diskIO.tIO_sec != null) lines.push(`Total IOPS: ${diskIO.tIO_sec.toFixed(0)}`);
             if (diskIO.tWaitPercent != null) lines.push(`Wait %: ${diskIO.tWaitPercent}`)
             if (diskIO.tWaitTime != null) lines.push(`Wait time: ${(diskIO.tWaitTime / 1e6).toFixed(2)} ms`)
             if (lines.length === 0) {
               lines.push('No data available.');
            }

  const embed = new EmbedBuilder()
    .setTitle('Disk Stats')
    .setColor(0x0060FF)
    .setDescription(lines.join('\n'));

  message.reply({ embeds: [embed] });
}

            else if (sub === `-help`) {
                const embed = new EmbedBuilder()
                .setTitle(`\`%stat\` help`)
                .setColor(0x0060ff)
                .setDescription(`
                **Available arguments for \`%stat\` command:**
                 \`-cpu\` Shows CPU temperature, load, and clock speed
                 \`-mem\` Shows memory usage
                 \`-uptime\` Shows system uptime
                 \`-net\` Shows network stats (ping, download/upload)
                 \`-disk\` Shows disk load information
                 \`-help\` Shows this help message
                 `)
                message.reply({ embeds: [embed] });
            }

            else {
                const embed = new EmbedBuilder()
                .setTitle(`Error`)
                .setColor(0x0060ff)
                .setDescription(`Invalid argument. Use \`%stat -help\` for a list of available arguments.`)
                message.reply({ embeds: [embed] });
            }
    }

    else if (command === `sysinfo`) {

        const sub = args.shift()?.toLowerCase();
        
        if (!sub) {
            const embed = new EmbedBuilder()
                .setTitle(`Error`)
                .setColor(0x0060ff)
                .setDescription(`No argument provided. Use \`%sysinfo -help\` for a list of available arguments.`)
                message.reply({ embeds: [embed] });
        }

        else if (sub === `-cpu`) {
            const cpuInfo = await si.cpu();
            const lines = [''];
         if (cpuInfo.arch) {
            lines.push(`Architecture: ${cpuInfo.arch}`);
           }
         if (cpuInfo.opmode) {
            lines.push(`CPU op modes: ${cpuInfo.opmode}`);
           }
         if (cpuInfo.addressSizes) {
            lines.push(`Address sizes: ${cpuInfo.addressSizes}`);
           }
         if (cpuInfo.byteOrder) {
            lines.push(`Byte order: ${cpuInfo.byteOrder}`);
           }
         if (cpuInfo.cores) {
                lines.push(`Logical CPUs (threads): ${cpuInfo.cores}`);
            }
         if (cpuInfo.physicalCores) {
                lines.push(`Physical CPUs (cores): ${cpuInfo.physicalCores}`);
            }
         if (cpuInfo.performanceCores) {
                lines.push(`Performance cores: ${cpuInfo.performanceCores}`);
            }
         if (cpuInfo.efficiencyCores) {
                lines.push(`Efficiency cores: ${cpuInfo.efficiencyCores}`);
            }
         if (cpuInfo.threadsPerCore) {
                lines.push(`Threads per core: ${cpuInfo.threadsPerCore}`);
            }
         if (cpuInfo.sockets) {
                lines.push(`Socket(s): ${cpuInfo.sockets}`);
            }
         if (cpuInfo.coresPerSocket) {
                lines.push(`Cores per socket: ${cpuInfo.coresPerSocket}`);
            }
         if (cpuInfo.vendor) {
                lines.push(`Vendor ID: ${cpuInfo.vendor}`);
            }
         if (cpuInfo.brand) {
                lines.push(`Model: ${cpuInfo.brand}`);
            }
         if (cpuInfo.family) {
                lines.push(`CPU family: ${cpuInfo.family}`);
            }
         if (cpuInfo.model) {
                lines.push(`Model: ${cpuInfo.model}`);
            }
         if (cpuInfo.stepping) {
                lines.push(`Stepping: ${cpuInfo.stepping}`);
            }
         if (cpuInfo.boost) {
                lines.push(`Frequency boost: ${cpuInfo.boost}`);
            }
         if (cpuInfo.scaling) {
                lines.push(`Frequency scaling: ${cpuInfo.scaling}`);
            }
         if (cpuInfo.speedMax) {
                lines.push(`Max frequency: ${cpuInfo.speedMax} GHz`);
            }
         if (cpuInfo.speedMin) {
                lines.push(`Min frequency: ${cpuInfo.speedMin} GHz`);
            }
         if (cpuInfo.virtualization) {
                lines.push(`Virtualization: ${cpuInfo.virtualization}`);
            }
         if (cpuInfo.cache.l1d) {
                lines.push(`L1d cache: ${cpuInfo.cache.l1d} B`);
            }
         if (cpuInfo.cache.l1i) {
                lines.push(`L1i cache: ${cpuInfo.cache.l1i} B`);
            }
         if (cpuInfo.cache.l2) {
                lines.push(`L2 cache: ${cpuInfo.cache.l2} B`);
            }
         if (cpuInfo.cache.l3) {
                lines.push(`L3 cache: ${cpuInfo.cache.l3} B`);
            }
         if (cpuInfo.cache.sram) {
                lines.push(`SRAM: ${cpuInfo.cache.sram} B`);
            }
         if (cpuInfo.numaNodes) {
                lines.push(`NUMA nodes: ${cpuInfo.numaNodes}`);
            }
         if (cpuInfo.numaNodesPerSocket) {
                lines.push(`NUMA node(s) per socket: ${cpuInfo.numaNodesPerSocket}`);
            }
         if (cpuInfo.numaNodesPerCore) {
                lines.push(`NUMA node(s) per core: ${cpuInfo.numaNodesPerCore}`);
            }
         if (cpuInfo.numaNodesPerThread) {
                lines.push(`NUMA node(s) per thread: ${cpuInfo.numaNodesPerThread}`);
            }
         if (lines.length === 0) {
               lines.push('No data available.');
            }
            const embed = new EmbedBuilder()
                .setTitle(`CPU info`)
                .setColor(0x0060ff)
                .setDescription(lines.join(`\n`))
                message.reply({ embeds: [embed] });
        }
        
        else if (sub === '-mem') {
            const memModules = await si.memLayout();
            const lines = [''];
            for (let i = 0; i < memModules.length; i++) {
             const module = memModules[i];

             lines.push(`**Module ${i + 1}**`);
             if (module.size) {
             lines.push(`Total: ${(module.size / 1e9).toFixed(2)} GB`);
             }
             if (module.type) {
             lines.push(`Type: ${module.type}`);
             }
             if (module.ecc) {
             lines.push(`ECC: ${module.ecc}`);
             }
             if (module.busSpeed) {
             lines.push(`Speed: ${module.busSpeed} MHz`);
             }
             if (module.voltageConfigured) {
             lines.push(`Voltage: ${module.voltageConfigured} V`);
             }
             if (module.rank) {
             lines.push(`Rank: ${module.rank}`);
             }
             if (module.formFactor) {
             lines.push(`Form factor: ${module.formFactor}`);
             }
             if (module.deviceLocator) {
             lines.push(`Slot: ${module.deviceLocator}`);
             }
             if (module.bankLocator) {
             lines.push(`Bank: ${module.bankLocator}`);
             }
             if (module.manufacturer) {
             lines.push(`Manufacturer: ${module.manufacturer}`);
             }
             if (module.partNum) {
             lines.push(`Part: ${module.partNum}`);
             }
             if (lines.length === 0) {
               lines.push('No data available.');
            }
            }
            const embed = new EmbedBuilder()
                .setTitle(`Memory info`)
                .setColor(0x0060ff)
                .setDescription(lines.join(`\n`))
                message.reply({ embeds: [embed] });
        }
        else if (sub === `-disk`) {
            const diskInfo = await si.diskLayout();
            const lines = [``];
            for (let i = 0; i < diskInfo.length; i++) {
                const disk = diskInfo[i]
                lines.push(`**Disk ${i + 1}**`)
                if (disk.size) {
                    lines.push (`Total usable disk space: ${(disk.size / 1e9).toFixed(2)} GB`)
                }
                if (disk.type) {
                  lines.push (`Disk type: ${disk.type}`)
                }
                if (disk.interfaceType) {
                    lines.push (`Interface type: ${disk.interfaceType}`)
                }
                if (disk.name) {
                   lines.push (`Name: ${disk.name}`)
                }
                if (disk.vendor){
                  lines.push (`Disk vendor: ${disk.vendor}`)
                }
                if (disk.serialNum) {
                lines.push (`Serial number: ${disk.serialNum}`)
                }
                if (disk.firmwareRevision) {
                    lines.push (`Firmware revision: ${disk.firmwareRevision}`)
                }
                if (disk.bytesPerSector) {
                    lines.push (`Bytes per sector: ${disk.bytesPerSector}`)
                }
                if (disk.smartStatus)
                    lines.push(`SMART status: ${disk.smartStatus}`)
                if (disk.smartData) {
                    lines.push (`SMART data: ${disk.smartData}`)
                }
             if (lines.length === 0) {
               lines.push('No data available.');
            }                
                lines.push(``)
            }
                const embed = new EmbedBuilder()
                .setTitle(`Disk info`)
                .setColor(0x0060ff)
                .setDescription(lines.join(`\n`))
                message.reply({ embeds: [embed] });
        }

        else if (sub === `-os`) {
            const osInfo = await si.osInfo();
            const embed = new EmbedBuilder()
                .setTitle(`OS info`)
                .setColor(0x0060ff)
                .setDescription(`
                Platform: ${osInfo.platform}
                Distro: ${osInfo.distro}
                Release: ${osInfo.release}
                Codename: ${osInfo.codename}
                Kernel: ${osInfo.kernel}
                Architecture: ${osInfo.arch}
                Hostname: ${osInfo.hostname}
                Build number: ${osInfo.build}
                Service pack: ${osInfo.servicepack}`)
                message.reply({ embeds: [embed] });
        }

        else if (sub === `-net`) {
            const networkInfo = await si.networkInterfaces();
            const lines = [''];
            for (let i = 0; i < networkInfo.length; i++) {
                const iface = networkInfo[i];
                lines.push(`**Interface ${i + 1}**`);
                if (iface.iface) {
                    lines.push(`Network interface: ${iface.iface}`);
                }
                if (iface.ip4) {
                    lines.push(`IPv4 address: ${iface.ip4}`);
                }
                if (iface.ip6) {
                    lines.push(`IPv6 address: ${iface.ip6}`);
                }
                if (iface.mac) {
                    lines.push(`MAC address: ${iface.mac}`);
                }
                if (iface.speed) {
                    lines.push(`Speed: ${iface.speed} Mbps`);
                }
                if (iface.type) {
                    lines.push(`Type: ${iface.type}`);
                }
                if (iface.duplex) {
                    lines.push(`Duplex: ${iface.duplex}`);
                }
                if (iface.operstate) {
                    lines.push(`Operational status: ${iface.operstate}`);
                }
             if (lines.length === 0) {
               lines.push('No data available.');
            }                
                lines.push('');
            }
            const embed = new EmbedBuilder()
                .setTitle(`Network info`)
                .setColor(0x0060ff)
                .setDescription(lines.join(`\n`))
                message.reply({ embeds: [embed] });
        }

        else if (sub === `-help`) {
            const embed = new EmbedBuilder()
                .setTitle(`\`%sysinfo\`help`)
                .setColor(0x0060ff)
                .setDescription(`
                **Available arguments for \`%sysinfo\` command:**
                \`-cpu\` Shows detailed CPU information
                \`-mem\` Shows detailed memory information
                \`-disk\` Shows detailed disk information
                \`-os\` Shows OS information
                \`-net\` Shows network information
                \`-help\` Shows this help message
                `)
                message.reply({ embeds: [embed] });
        }
    }

    else if (command === `help`) {
        const embed = new EmbedBuilder()
            .setTitle(`Help`)
            .setColor(0x0060ff)
            .setDescription(`
                    **Available commands:**
            \`%stat\` Shows system stats
            \`%sysinfo\` Shows system information
            \`%test\` Pings the bot
            \`%help\` Shows this help message
            `)
                message.reply({ embeds: [embed] });
    }

    else if (command === `test`) {
        const embed = new EmbedBuilder()
            .setTitle(`Test successful`)
            .setColor(0x0060ff)
            .setDescription(`da bot works :D`)
            message.reply({ embeds: [embed] });
    }

    else {
        const embed = new EmbedBuilder()
            .setTitle(`Error`)
            .setColor(0x0060ff)
            .setDescription(`Invalid command. Use \`%help\` for a list of available commands`)
            message.reply({ embeds: [embed] });
    }
});