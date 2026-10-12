# Generic Server Status Bot
A simple Discord bot to send performance metrics and system information of the server it runs on to your discord

## Features
### Performance monitoring (%stat)
- CPU load + temps information
- Memory usage
- System uptime
- Network latency and download/upload speeds
- Disk I/O statistics
### System information (%sysinfo)
- Detailed CPU information
- RAM information (capacity, manufacturer, etc)
- Disk information
- OS details
- Network interface information

Note: Some features are not available depending on system configuration, and their lines will be hidden in the output.

## Commands
### Performance monitoring (%stat)
**Arguments**

`-cpu` CPU information

`-mem` Memory information

`-uptime` Uptime

`-net` Network load

`-disk` Disk load

### System information
**Arguments**

`-cpu` CPU information

`-mem` Memory information

`-os` OS information

`-net` Network interface information

`-disk` Disk information

## Installation
1. Install node.js with
   `npm install`
2. Clone the repository
3. Register the bot with Discord 
   https://discord.com/developers
4.  Create a file named `.env` with `DISCORD_TOKEN=` followed by the token you got from Discord Developer Portal
5. Open your terminal in the cloned repo folder
6. Run the bot with `node index.js`
