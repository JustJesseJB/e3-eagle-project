import { TerminalEntry } from '@/contexts/TerminalContext';

// Type for command handler functions
export type CommandHandler = (args: string[]) => Promise<TerminalEntry[]>;

// Command registry to store all available commands
class CommandRegistry {
  private commands: Record<string, CommandHandler> = {};
  
  // Register a new command
  register(commandName: string, handler: CommandHandler): void {
    // Normalize command name (ensure it starts with / for consistency)
    const normalizedName = commandName.startsWith('/') 
      ? commandName 
      : `/${commandName}`;
    
    this.commands[normalizedName] = handler;
    
    // Also register without the slash for user convenience
    if (normalizedName.startsWith('/')) {
      const nameWithoutSlash = normalizedName.substring(1);
      this.commands[nameWithoutSlash] = handler;
    }
  }
  
  // Check if a command exists
  exists(commandName: string): boolean {
    return !!this.commands[commandName];
  }
  
  // Execute a command
  async execute(commandName: string, args: string[] = []): Promise<TerminalEntry[]> {
    const handler = this.commands[commandName];
    
    if (!handler) {
      return [
        { type: 'error', text: `Command not recognized: ${commandName}` },
        { type: 'system', text: 'Type /help for available commands' }
      ];
    }
    
    try {
      return await handler(args);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      return [
        { type: 'error', text: `Error executing command: ${commandName}` },
        { type: 'error', text: (error as Error).message || 'Unknown error occurred' }
      ];
    }
  }
  
  // Get list of all registered commands
  getCommandList(): string[] {
    // Only return the commands with / prefix for the help menu
    return Object.keys(this.commands).filter(cmd => cmd.startsWith('/'));
  }
}

// Create and export a singleton instance
export const commandRegistry = new CommandRegistry();

// Function to parse command input
export function parseCommand(input: string): { command: string, args: string[] } {
  const trimmedInput = input.trim();
  
  // Split by spaces, but respect quoted arguments
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  const parts: string[] = [];
  let match;
  
  while ((match = regex.exec(trimmedInput)) !== null) {
    // If the match is a quoted string, use the captured group
    // Otherwise use the full match
    if (match[1] || match[2]) {
      parts.push(match[1] || match[2]);
    } else {
      parts.push(match[0]);
    }
  }
  
  // First part is the command, rest are arguments
  const command = parts[0] || '';
  const args = parts.slice(1);
  
  return { command, args };
}

// Process an input string
export async function processCommandInput(input: string): Promise<TerminalEntry[]> {
  // Add the input to history
  const historyEntry: TerminalEntry = {
    type: 'input',
    text: `> ${input}`
  };
  
  // If empty input, just return the history entry
  if (!input.trim()) {
    return [historyEntry];
  }
  
  // Parse the command and arguments
  const { command, args } = parseCommand(input);
  
  // Execute the command
  const commandResponse = await commandRegistry.execute(command, args);
  
  // Return both the input history and the command response
  return [historyEntry, ...commandResponse];
}

// Easter egg: randomly trigger a glitch effect with small probability
export function maybeGlitch(): TerminalEntry | null {
  if (Math.random() > 0.9) {
    return { 
      type: 'glitch', 
      text: 'E̵̛͖͊R̴̡̗̓̕Ř̸̹̂O̶̰̍̈́R̷̰̦̽:̶͈̓͋ ̶̮̍S̶̻̉̓E̷̮̚Q̷̫̈́̉U̵̪͝E̶̛̼̱̒N̶̳̈́C̸̜̍E̶̩̎ ̸̼̮̔̀C̸̲̰̓̊O̷̠͑Ṛ̶̡̔R̸͚͑U̶̥̞̔P̷͎̂T̶̼̐̈E̴̪̼̎D̸̲̈́̍' 
    };
  }
  return null;
}