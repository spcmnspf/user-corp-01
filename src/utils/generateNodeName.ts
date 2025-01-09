export function generateNodeName(): string {
  const cities = ['Neo', 'Cyber', 'Tech', 'Synth', 'Arc', 'Pulse', 'Nexus', 'Echo', 'Quantum', 'Vector'];
  const suffixes = ['plex', 'grid', 'hub', 'core', 'port', 'gate', 'node', 'zone', 'dome', 'tower'];
  const directions = ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'];

  const cityName = cities[Math.floor(Math.random() * cities.length)] + 
                   suffixes[Math.floor(Math.random() * suffixes.length)];
  const nodeNum = Math.floor(1000 + Math.random() * 9000);
  const direction = directions[Math.floor(Math.random() * directions.length)];

  return `${cityName}-${nodeNum}-${direction}`;
}
