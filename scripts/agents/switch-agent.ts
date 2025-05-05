import fs from 'fs';
import path from 'path';

const ROOT_CURSORRULES_PATH = path.join(__dirname, '../../.cursorrules');
const BRAIN_CONFIG_PATH = path.join(__dirname, '../../.brain/config.json');
const BRAIN_DIR = path.join(__dirname, '../../.brain');
const AGENT_RULE_MARKER = '# --- AGENT-SPECIFIC RULES BELOW ---';

interface BrainConfig {
  agentPath: string;
  defaultAgent: string;
  // Add other fields from your config if necessary for type safety
  [key: string]: any; 
}

const agentId = process.argv[2];

if (!agentId) {
  console.error('Error: No agent ID provided.');
  console.log('Usage: pnpm change-agent <agent-id>');
  console.log('Example: pnpm change-agent 1-agent-tony-stark');
  process.exit(1);
}

const agentCursorRulesPath = path.join(BRAIN_DIR, agentId, '.cursorrules');

// --- Validate Agent ID and Paths ---
if (!fs.existsSync(agentCursorRulesPath)) {
  console.error(`Error: Agent rules file not found for ID '${agentId}'.`);
  console.error(`Looked in: ${agentCursorRulesPath}`);
  process.exit(1);
}

if (!fs.existsSync(BRAIN_CONFIG_PATH)) {
  console.error(`Error: Brain config file not found at ${BRAIN_CONFIG_PATH}`);
  process.exit(1); 
}

if (!fs.existsSync(ROOT_CURSORRULES_PATH)) {
  console.warn(`Warning: Root .cursorrules file not found at ${ROOT_CURSORRULES_PATH}. It will be created.`);
  // Create an empty file with the marker if it doesn't exist
  fs.writeFileSync(ROOT_CURSORRULES_PATH, `${AGENT_RULE_MARKER}\n`, 'utf8');
}

try {
  // --- Update .brain/config.json ---
  console.log(`Reading ${BRAIN_CONFIG_PATH}...`);
  const configRaw = fs.readFileSync(BRAIN_CONFIG_PATH, 'utf8');
  const config: BrainConfig = JSON.parse(configRaw);

  config.agentPath = agentId;
  config.defaultAgent = agentId;

  console.log(`Updating config for agent: ${agentId}`);
  fs.writeFileSync(BRAIN_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  console.log('Successfully updated .brain/config.json.');

  // --- Update root .cursorrules ---
  console.log(`Reading root ${ROOT_CURSORRULES_PATH}...`);
  const rootRulesContent = fs.readFileSync(ROOT_CURSORRULES_PATH, 'utf8');
  console.log(`Reading agent rules from ${agentCursorRulesPath}...`);
  const agentRulesContent = fs.readFileSync(agentCursorRulesPath, 'utf8');

  const markerIndex = rootRulesContent.indexOf(AGENT_RULE_MARKER);
  let newRootRulesContent = '';

  if (markerIndex !== -1) {
    // Marker found, replace content below it
    const contentAboveMarker = rootRulesContent.substring(0, markerIndex);
    newRootRulesContent = `${contentAboveMarker}${AGENT_RULE_MARKER}\n${agentRulesContent}`; 
    console.log('Marker found in root .cursorrules. Replacing content below marker...');
  } else {
    // Marker not found, append agent rules (and add marker for future use)
    console.warn('Marker not found in root .cursorrules. Appending agent rules...');
    newRootRulesContent = `${rootRulesContent}\n\n${AGENT_RULE_MARKER}\n${agentRulesContent}`; 
  }

  console.log(`Writing updated rules to ${ROOT_CURSORRULES_PATH}...`);
  fs.writeFileSync(ROOT_CURSORRULES_PATH, newRootRulesContent, 'utf8');
  console.log('Successfully updated root .cursorrules file.');

  console.log(`\n✅ Successfully switched active agent to: ${agentId}`);

} catch (error) {
  console.error('Error during agent switching process:', error);
  process.exit(1);
}
