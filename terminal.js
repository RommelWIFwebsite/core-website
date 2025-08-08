/**
 * CORE CRYPTOCURRENCY WEBSITE - TERMINAL MODULE
 * Interactive terminal simulator with commands and effects
 * ==================================================================
 */

// Terminal Configuration
const TERMINAL_CONFIG = {
  prompt: 'core@blockchain:~$',
  welcomeMessage: 'Welcome to CORE Terminal v2.1.0',
  typingSpeed: 50,
  maxHistoryLength: 100,
  commandTimeout: 5000,
  matrixMode: false,
  hackerMode: false
};

// Terminal State
const terminalState = {
  currentInput: '',
  commandHistory: [],
  historyIndex: -1,
  isProcessing: false,
  outputBuffer: [],
  cursorBlinking: true,
  commandCount: 0,
  userLevel: 'guest',
  unlockedCommands: new Set(['help', 'about', 'clear', 'whoami'])
};

// Command definitions
const commands = {
  help: {
    description: 'Show available commands',
    usage: 'help [command]',
    level: 'guest',
    execute: (args) => {
      if (args.length > 0) {
        const cmd = args[0].toLowerCase();
        if (commands[cmd]) {
          return [
            `Command: ${cmd}`,
            `Description: ${commands[cmd].description}`,
            `Usage: ${commands[cmd].usage}`,
            `Level: ${commands[cmd].level}`
          ];
        } else {
          return [`Command '${cmd}' not found. Type 'help' for available commands.`];
        }
      }
      
      const availableCommands = Object.keys(commands).filter(cmd => 
        terminalState.unlockedCommands.has(cmd) || commands[cmd].level === 'guest'
      );
      
      return [
        'Available commands:',
        '',
        ...availableCommands.map(cmd => `  ${cmd.padEnd(12)} - ${commands[cmd].description}`),
        '',
        'Type "help [command]" for detailed information.',
        'Hint: Try exploring to unlock hidden commands...'
      ];
    }
  },

  about: {
    description: 'Learn about the CORE philosophy',
    usage: 'about [section]',
    level: 'guest',
    execute: (args) => {
      if (args.length > 0) {
        const section = args[0].toLowerCase();
        const sections = {
          philosophy: [
            'THE CORE PHILOSOPHY',
            '',
            'In everything that exists - every coin, every person, every place -',
            'there lies a fundamental essence, a CORE that defines its true nature.',
            '',
            'Through blockchain technology, we create permanent records of value,',
            'trust, and connection. Love moves through these digital pathways,',
            'binding all participants in an eternal network of corecore.',
            '',
            'The CORE token represents this universal truth: that at the center',
            'of all things lies something pure, something essential, something infinite.'
          ],
          blockchain: [
            'BLOCKCHAIN & CORE',
            '',
            'Our Solana blockchain implementation focuses on:',
            '• Lightning-fast transactions (400ms confirmation)',
            '• Low transaction fees (<$0.01)',
            '• High throughput (65,000 TPS capacity)',
            '• Proof of Stake consensus',
            '• Cross-chain compatibility via Wormhole',
            '',
            'Every transaction carries not just value, but meaning.',
            'Every block contains not just data, but essence.',
            'Every confirmation strengthens the core of our network.'
          ],
          tokenomics: [
            'CORE TOKENOMICS',
            '',
            'Total Supply: 1,000,000,000 CORE',
            'Distribution:',
            '  40% - Liquidity Pool',
            '  30% - Community Rewards',
            '  20% - Development',
            '  10% - Marketing',
            '',
            'Utility:',
            '• Governance voting rights',
            '• Staking rewards (up to 12% APY)',
            '• Ecosystem access tokens',
            '• Transaction fee discounts'
          ]
        };
        
        return sections[section] || [`Section '${section}' not found. Available: philosophy, blockchain, tokenomics`];
      }
      
      return [
        '╔══════════════════════════════════════╗',
        '║              CORE TOKEN              ║',
        '╚══════════════════════════════════════╝',
        '',
        'The essence of everything, connecting all through love.',
        '',
        'CORE represents the fundamental truth that at the center',
        'of every coin, person, and place lies something eternal.',
        'Through blockchain, love moves via corecore, creating',
        'an unbreakable bond between all participants.',
        '',
        'Contract: 4FdojUmXeaFMBG6yUaoufAC5Bz7u9AwnSAMizkx5pump',
        'Network: Solana Mainnet',
        'Standard: SPL Token',
        '',
        'Type "about philosophy" for deeper understanding.',
        'Type "about blockchain" for technical details.',
        'Type "about tokenomics" for economic information.'
      ];
    }
  },

  clear: {
    description: 'Clear terminal screen',
    usage: 'clear',
    level: 'guest',
    execute: () => {
      clearTerminalOutput();
      return [];
    }
  },

  whoami: {
    description: 'Display current user information',
    usage: 'whoami',
    level: 'guest',
    execute: () => {
      return [
        `User: ${terminalState.userLevel}`,
        `Commands executed: ${terminalState.commandCount}`,
        `Terminal session: ${formatUptime()}`,
        `Access level: ${terminalState.userLevel.toUpperCase()}`,
        terminalState.userLevel === 'guest' ? 'Hint: Try "sudo access" to elevate privileges' : ''
      ].filter(line => line !== '');
    }
  },

  status: {
    description: 'Show system status',
    usage: 'status',
    level: 'guest',
    execute: () => {
      unlock('status');
      return [
        '╔═══════════════ SYSTEM STATUS ═══════════════╗',
        '║                                             ║',
        `║ Network: ONLINE          Block: ${Math.floor(Math.random() * 1000000) + 18500000}     ║`,
        `║ Latency: ${Math.floor(Math.random() * 50) + 10}ms            Gas: ${Math.floor(Math.random() * 100) + 20} gwei     ║`,
        `║ Peers: ${Math.floor(Math.random() * 500) + 1000}              TPS: ${Math.floor(Math.random() * 10000) + 5000}        ║`,
        '║ Core temp: 42°C          Memory: 67%        ║',
        '║                                             ║',
        '╚═════════════════════════════════════════════╝',
        '',
        'All systems operational. CORE network stable.'
      ];
    }
  },

  price: {
    description: 'Show CORE token price information',
    usage: 'price',
    level: 'guest',
    execute: () => {
      unlock('price');
      const price = (Math.random() * 0.1 + 0.05).toFixed(6);
      const change = (Math.random() * 20 - 10).toFixed(2);
      const volume = (Math.random() * 1000000 + 500000).toFixed(0);
      
      return [
        '╔══════════════ CORE PRICE DATA ══════════════╗',
        '║                                             ║',
        `║ Current Price: $${price}                    ║`,
        `║ 24h Change: ${change > 0 ? '+' : ''}${change}%                      ║`,
        `║ 24h Volume: $${parseInt(volume).toLocaleString()}                        ║`,
        `║ Market Cap: $${(price * 1000000000).toFixed(0)}                    ║`,
        '║                                             ║',
        '║ ATH: $0.125000      ATL: $0.001250          ║',
        '║                                             ║',
        '╚═════════════════════════════════════════════╝',
        '',
        '💡 Remember: Price is temporary, CORE is eternal.'
      ];
    }
  },

  sudo: {
    description: 'Execute commands with elevated privileges',
    usage: 'sudo [command]',
    level: 'guest',
    execute: (args) => {
      if (args.length === 0) {
        return ['Usage: sudo [command]', 'Available: sudo access, sudo matrix, sudo hack'];
      }
      
      const subCmd = args[0].toLowerCase();
      
      switch (subCmd) {
        case 'access':
          if (terminalState.userLevel === 'guest') {
            terminalState.userLevel = 'admin';
            unlock(['sudo', 'matrix', 'hack', 'scan', 'encrypt', 'decode']);
            return [
              'Access granted. Welcome, Administrator.',
              'New commands unlocked. Type "help" to see them.',
              '⚠️  With great power comes great responsibility.'
            ];
          }
          return ['You already have admin access.'];
          
        case 'matrix':
          TERMINAL_CONFIG.matrixMode = !TERMINAL_CONFIG.matrixMode;
          return [`Matrix mode ${TERMINAL_CONFIG.matrixMode ? 'ENABLED' : 'DISABLED'}`];
          
        case 'hack':
          return executeHackSequence();
          
        default:
          return [`sudo: ${subCmd}: command not found`];
      }
    }
  },

  matrix: {
    description: 'Enter the matrix',
    usage: 'matrix',
    level: 'admin',
    execute: () => {
      return [
        '🔴 ENTERING MATRIX MODE 🔴',
        '',
        '01001000 01100101 01101100 01101100 01101111',
        '01001110 01100101 01101111',
        '',
        'Wake up, Neo...',
        'The Matrix has you...',
        'Follow the white rabbit...',
        '',
        '🔴 MATRIX MODE ACTIVE 🔴',
        'Reality is now optional.'
      ];
    }
  },

  hack: {
    description: 'Initiate hacking protocol',
    usage: 'hack [target]',
    level: 'admin',
    execute: (args) => {
      const target = args[0] || 'random_system';
      return executeHackSequence(target);
    }
  },

  scan: {
    description: 'Scan for vulnerabilities',
    usage: 'scan [target]',
    level: 'admin',
    execute: (args) => {
      const target = args[0] || 'localhost';
      return [
        `Scanning ${target}...`,
        '',
        'Port 22: OPEN (SSH)',
        'Port 80: OPEN (HTTP)',
        'Port 443: OPEN (HTTPS)',
        'Port 8080: FILTERED',
        '',
        'Vulnerabilities found: 0',
        'Security rating: A+',
        '',
        'System appears secure. CORE protocol active.'
      ];
    }
  },

  encrypt: {
    description: 'Encrypt data using CORE algorithm',
    usage: 'encrypt [data]',
    level: 'admin',
    execute: (args) => {
      if (args.length === 0) {
        return ['Usage: encrypt [data]'];
      }
      
      const data = args.join(' ');
      const encrypted = btoa(data).split('').reverse().join('');
      
      return [
        'Encrypting with CORE-256 algorithm...',
        '',
        `Original: ${data}`,
        `Encrypted: ${encrypted}`,
        '',
        '✅ Encryption complete. Data secured.'
      ];
    }
  },

  decode: {
    description: 'Decode CORE encrypted data',
    usage: 'decode [encrypted_data]',
    level: 'admin',
    execute: (args) => {
      if (args.length === 0) {
        return ['Usage: decode [encrypted_data]'];
      }
      
      try {
        const encrypted = args.join(' ');
        const decoded = atob(encrypted.split('').reverse().join(''));
        
        return [
          'Decoding with CORE-256 algorithm...',
          '',
          `Encrypted: ${encrypted}`,
          `Decoded: ${decoded}`,
          '',
          '✅ Decoding complete.'
        ];
      } catch (e) {
        return ['❌ Invalid encrypted data format.'];
      }
    }
  },

  fortune: {
    description: 'Get a random CORE fortune',
    usage: 'fortune',
    level: 'guest',
    execute: () => {
      unlock('fortune');
      const fortunes = [
        'The core of success is never giving up.',
        'In every transaction, find the essence of trust.',
        'Love moves through blockchain via corecore.',
        'The strongest chains are built one block at a time.',
        'At the center of every storm lies perfect calm.',
        'Value is not in the coin, but in the core.',
        'Decentralization is the path to true freedom.',
        'Smart contracts, smarter communities.',
        'HODL not just tokens, but principles.',
        'The future is decentralized, the present is CORE.'
      ];
      
      const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      
      return [
        '🔮 CORE Fortune Cookie 🔮',
        '',
        `"${fortune}"`,
        '',
        '💫 May the CORE be with you.'
      ];
    }
  },

  easter: {
    description: 'Hidden command - find the others!',
    usage: 'easter',
    level: 'hidden',
    execute: () => {
      unlock('easter');
      return [
        '🥚 EASTER EGG FOUND! 🥚',
        '',
        'Congratulations! You found a hidden command.',
        '',
        'The CORE team loves curious explorers.',
        'Keep digging - there are more secrets...',
        '',
        'Hint: Try "konami" if you know the code...'
      ];
    }
  },

  konami: {
    description: 'The legendary code',
    usage: 'konami',
    level: 'hidden',
    execute: () => {
      unlock('konami');
      return [
        '🎮 KONAMI CODE ACTIVATED! 🎮',
        '',
        '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️',
        '',
        'YOU HAVE UNLOCKED MAXIMUM POWER!',
        '',
        '🌟 30 extra lives granted',
        '🚀 Speed boost activated',
        '💎 Diamond hands enabled',
        '∞ Infinite CORE energy',
        '',
        'You are now a CORE legend! 🏆'
      ];
    }
  },

  exit: {
    description: 'Close terminal session',
    usage: 'exit',
    level: 'guest',
    execute: () => {
      return [
        'Closing terminal session...',
        'Thank you for using CORE Terminal.',
        'Connection terminated.',
        '',
        '◉ CORE lives forever ◉'
      ];
    }
  }
};

// Initialize terminal
function initializeTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  
  if (!terminalInput || !terminalBody) {
    console.error('Terminal elements not found');
    return;
  }
  
  // Set up event listeners
  terminalInput.addEventListener('keydown', handleTerminalKeydown);
  terminalInput.addEventListener('input', handleTerminalInput);
  
  // Focus terminal input when clicking anywhere in terminal
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });
  
  // Initial focus
  terminalInput.focus();
  
  console.log('🖥️ Terminal initialized');
}

// Handle terminal keydown events
function handleTerminalKeydown(e) {
  const input = e.target;
  
  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      processCommand(input.value.trim());
      input.value = '';
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      navigateHistory(-1);
      break;
      
    case 'ArrowDown':
      e.preventDefault();
      navigateHistory(1);
      break;
      
    case 'Tab':
      e.preventDefault();
      autoComplete(input);
      break;
      
    case 'l':
      if (e.ctrlKey) {
        e.preventDefault();
        processCommand('clear');
      }
      break;
  }
}

// Handle terminal input
function handleTerminalInput(e) {
  terminalState.currentInput = e.target.value;
}

// Process terminal command
function processCommand(input) {
  if (terminalState.isProcessing) return;
  
  terminalState.isProcessing = true;
  
  // Add to command history
  if (input.trim() !== '') {
    terminalState.commandHistory.push(input);
    if (terminalState.commandHistory.length > TERMINAL_CONFIG.maxHistoryLength) {
      terminalState.commandHistory.shift();
    }
    terminalState.historyIndex = terminalState.commandHistory.length;
    terminalState.commandCount++;
  }
  
  // Add command line to output
  addToOutput(`${TERMINAL_CONFIG.prompt} ${input}`, 'command-line');
  
  // Parse command
  const args = input.trim().split(/\s+/);
  const command = args.shift()?.toLowerCase() || '';
  
  // Execute command
  setTimeout(() => {
    executeCommand(command, args);
    terminalState.isProcessing = false;
  }, 100);
}

// Execute command
function executeCommand(command, args) {
  if (!command) {
    return;
  }
  
  if (commands[command]) {
    // Check if command is unlocked
    if (commands[command].level === 'hidden' && !terminalState.unlockedCommands.has(command)) {
      addToOutput('Command not found. Type "help" for available commands.', 'error');
      return;
    }
    
    if (commands[command].level === 'admin' && terminalState.userLevel !== 'admin') {
      addToOutput('Permission denied. Try "sudo access" first.', 'error');
      return;
    }
    
    try {
      const output = commands[command].execute(args);
      if (Array.isArray(output)) {
        output.forEach(line => addToOutput(line));
      } else if (output) {
        addToOutput(output);
      }
    } catch (error) {
      addToOutput(`Error executing command: ${error.message}`, 'error');
    }
  } else {
    // Check for typos and suggest similar commands
    const suggestion = findSimilarCommand(command);
    if (suggestion) {
      addToOutput(`Command '${command}' not found. Did you mean '${suggestion}'?`, 'error');
    } else {
      addToOutput(`Command '${command}' not found. Type 'help' for available commands.`, 'error');
    }
  }
  
  // Scroll to bottom
  scrollTerminalToBottom();
}

// Add output to terminal
function addToOutput(text, className = '') {
  const terminalOutput = document.getElementById('terminal-output');
  if (!terminalOutput) return;
  
  const line = document.createElement('div');
  line.className = `output-line ${className}`;
  
  if (TERMINAL_CONFIG.matrixMode && Math.random() < 0.3) {
    line.textContent = convertToMatrix(text);
    line.classList.add('matrix-text');
  } else {
    line.textContent = text;
  }
  
  terminalOutput.appendChild(line);
  
  // Apply typing effect
  if (text.length > 50) {
    typewriterEffect(line, text);
  }
}

// Clear terminal output
function clearTerminalOutput() {
  const terminalOutput = document.getElementById('terminal-output');
  if (terminalOutput) {
    terminalOutput.innerHTML = '';
  }
}

// Navigate command history
function navigateHistory(direction) {
  const input = document.getElementById('terminal-input');
  if (!input) return;
  
  if (direction === -1 && terminalState.historyIndex > 0) {
    terminalState.historyIndex--;
    input.value = terminalState.commandHistory[terminalState.historyIndex];
  } else if (direction === 1 && terminalState.historyIndex < terminalState.commandHistory.length - 1) {
    terminalState.historyIndex++;
    input.value = terminalState.commandHistory[terminalState.historyIndex];
  } else if (direction === 1 && terminalState.historyIndex === terminalState.commandHistory.length - 1) {
    terminalState.historyIndex = terminalState.commandHistory.length;
    input.value = '';
  }
}

// Auto-complete command
function autoComplete(input) {
  const currentValue = input.value.toLowerCase();
  const availableCommands = Object.keys(commands).filter(cmd => 
    cmd.startsWith(currentValue) && 
    (terminalState.unlockedCommands.has(cmd) || commands[cmd].level === 'guest')
  );
  
  if (availableCommands.length === 1) {
    input.value = availableCommands[0];
  } else if (availableCommands.length > 1) {
    addToOutput(`Available: ${availableCommands.join(', ')}`);
    scrollTerminalToBottom();
  }
}

// Find similar command (for typo correction)
function findSimilarCommand(input) {
  const availableCommands = Object.keys(commands).filter(cmd => 
    terminalState.unlockedCommands.has(cmd) || commands[cmd].level === 'guest'
  );
  
  return availableCommands.find(cmd => 
    levenshteinDistance(input, cmd) <= 2 && Math.abs(input.length - cmd.length) <= 2
  );
}

// Calculate Levenshtein distance
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Unlock commands
function unlock(command) {
  if (Array.isArray(command)) {
    command.forEach(cmd => terminalState.unlockedCommands.add(cmd));
  } else {
    terminalState.unlockedCommands.add(command);
  }
}

// Execute hack sequence
function executeHackSequence(target = 'target_system') {
  const sequences = [
    `Initiating hack on ${target}...`,
    'Scanning for vulnerabilities...',
    'Exploiting buffer overflow...',
    'Bypassing firewall...',
    'Accessing encrypted files...',
    'Downloading sensitive data...',
    'Covering tracks...',
    'Hack complete! 🎯'
  ];
  
  sequences.forEach((line, index) => {
    setTimeout(() => {
      addToOutput(line);
      if (index === sequences.length - 1) {
        addToOutput('⚠️ This is a simulation. CORE promotes ethical hacking only.');
      }
    }, index * 500);
  });
  
  return ['Hack sequence initiated...'];
}

// Convert text to matrix-style
function convertToMatrix(text) {
  return text.split('').map(char => {
    if (Math.random() < 0.5) {
      return Math.random() < 0.5 ? '1' : '0';
    }
    return char;
  }).join('');
}

// Typewriter effect
function typewriterEffect(element, text) {
  element.textContent = '';
  let i = 0;
  
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, TERMINAL_CONFIG.typingSpeed);
    }
  };
  
  type();
}

// Scroll terminal to bottom
function scrollTerminalToBottom() {
  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody) {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

// Format uptime
function formatUptime() {
  const start = new Date();
  start.setHours(start.getHours() - Math.floor(Math.random() * 24));
  const uptime = new Date() - start;
  const hours = Math.floor(uptime / (1000 * 60 * 60));
  const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Initialize terminal when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTerminal);
} else {
  initializeTerminal();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeTerminal,
    commands,
    terminalState,
    TERMINAL_CONFIG
  };
}
