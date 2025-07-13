// src/lib/commands/commandProcessor.ts

import { TerminalEntry } from '@/contexts/TerminalContext';

// Type for command handler functions
export type CommandHandler = (args: string[]) => Promise<TerminalEntry[]>;

// Command registry to store all available commands
class CommandRegistry {
  public commands: Record<string, CommandHandler> = {};
  
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

    console.log(`Command registered: ${commandName}`);
  }
  
  // Check if a command exists
  exists(commandName: string): boolean {
    return commandName in this.commands;
  }
  
  // Execute a command
  async execute(commandName: string, args: string[]): Promise<TerminalEntry[]> {
    if (this.exists(commandName)) {
      try {
        console.log(`Executing command: ${commandName} with args:`, args);
        return await this.commands[commandName](args);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        return [
          { type: 'error' as const, text: `Error executing command: ${commandName}` },
          { type: 'system' as const, text: 'Please try again or check console for details.' }
        ];
      }
    } else {
      console.warn(`Command not found: ${commandName}`);
      return [
        { type: 'error' as const, text: `Unknown command: ${commandName}` },
        { type: 'system' as const, text: 'Type /help for a list of available commands.' }
      ];
    }
  }
}

// Create a singleton command registry
export const commandRegistry = new CommandRegistry();

// Process a command input string
export async function processCommandInput(input: string): Promise<TerminalEntry[]> {
  // Trim input and check if it's empty
  const trimmedInput = input.trim();
  if (!trimmedInput) {
    return [];
  }
  
  // Parse command and arguments
  const parts = trimmedInput.split(' ');
  let command = parts[0];
  const args = parts.slice(1);
  
  // Normalize command (add / prefix if missing)
  // These are special commands that we want to ensure work regardless of prefix
  const specialCommands = ['mint', 'chat', 'classified', 'clear', 'help', 'connect', 'assets'];
  
  if (!command.startsWith('/')) {
    // For special commands, check with and without /
    if (specialCommands.includes(command.toLowerCase())) {
      command = `/${command}`;
    } else if (commandRegistry.exists(`/${command}`)) {
      command = `/${command}`;
    }
  }
  
  console.log(`Processing command: ${command} with args:`, args);
  console.log(`Available commands:`, Object.keys(commandRegistry.commands));
  
  // Execute the command
  try {
    return await commandRegistry.execute(command, args);
  } catch (error) {
    console.error('Error processing command:', error);
    return [
      { type: 'error' as const, text: 'An error occurred while processing your command.' },
      { type: 'system' as const, text: 'Please try again or type /help for assistance.' }
    ];
  }
}