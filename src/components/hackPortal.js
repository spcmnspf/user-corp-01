// components/hackPortal.js
import { useState } from 'react';
import Image from 'next/image'; // Import the Image component
import styles from '../styles/hackPortal.module.css';

const descriptions = {
  'NeoTech Syndicate': {
    image: '/img/neotec-syndicate01.jpg',
    text: 'Pioneers in neural implant technology, specializing in memory enhancement and consciousness backup solutions.',
  },
  'Quantum Nexus Corp': {
    image: '/img/quantum-nexus-corp01.jpg',
    text: 'Leaders in quantum computing and AI fusion, developing next-gen processing architectures.',
  },
  'CyberDyne Systems': {
    image: '/img/cyberdyne-systems01.jpg',
    text: 'Military-grade cybernetic enhancements and autonomous defense systems manufacturer.',
  },
  'Chrome Matrix Ltd': {
    image: '/img/chrome-matrix-ltd01.jpg',
    text: 'Virtual reality interfaces and neural network security solutions for the corporate elite.',
  },
  'Binary Dawn Industries': {
    image: '/img/binary-dawn-industries01.jpg',
    text: 'Synthetic organ manufacturing and biotech augmentation research facility.',
  },
  'Neon Pulse Technologies': {
    image: '/img/neon-pulse-technologies01.jpg',
    text: 'Holographic advertising and urban atmosphere control systems developer.',
  },
  'SynthCore Dynamics': {
    image: '/img/synthcore-dynamics01.jpg',
    text: 'Artificial consciousness research and digital immortality solutions provider.',
  },
  'Void Protocol Inc': {
    image: '/img/void-protocol-inc01.jpg',
    text: 'Deep space communication and quantum entanglement transportation systems.',
  },
  'DataStorm Solutions': {
    image: '/img/datastorm-solutions01.jpg',
    text: 'Information warfare and corporate espionage prevention specialists.',
  },
  'Neural Grid Systems': {
    image: '/img/neural-grid-systems01.jpg',
    text: 'Brain-machine interface pioneers and neural network infrastructure providers.',
  },
};

export default function HackPortal() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCompanyClick = (companyName) => {
    setSelectedCompany(companyName);
  };

  const generateCode = async () => {
    try {
      // Clear previous messages
      setError('');
      setCode('');
  
      if (!selectedCompany) {
        setError('Error: Please select a company first');
        return;
      }
  
      // Basic tampering detection
      if (window.devtools?.isOpen || window.Firebug?.version) {
        setError('Error: Invalid request');
        return;
      }
  
      // Use the authenticated user's email
      const email = 'user@example.com'; // Replace with actual user email if authentication is implemented
  
      // Check for suspicious patterns
      const suspiciousPatterns = [
        email.includes('script'),
        email.includes('eval'),
        email.length > 100,
      ];
  
      if (suspiciousPatterns.some((pattern) => pattern)) {
        setError('Error: Invalid request');
        return;
      }
  
      // Get existing codes first
      const existingCodes = JSON.parse(localStorage.getItem('generatedCodes')) || {};
  
      if (existingCodes[email]) {
        setCode(`Existing Key: ${existingCodes[email]}`);
        return;
      }
  
      // Add validation token
      const validationToken = btoa(email + Date.now());
  
      // Original code generation
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      const uuid = crypto.randomUUID();
  
      let code = 0n;
      for (let i = 0; i < email.length; i++) {
        code += BigInt(email.charCodeAt(i));
      }
  
      code = (code * 31n + BigInt(timestamp)) ^ BigInt(random);
      code = code + BigInt('0x' + uuid.replace(/-/g, ''));
  
      const hexCode = code.toString(16).toUpperCase();
      const paddedCode = hexCode.padStart(16, '0');
  
      // Store validation data
      sessionStorage.setItem('lastValidation', validationToken);
  
      // Store the new code
      existingCodes[email] = paddedCode;
      localStorage.setItem('generatedCodes', JSON.stringify(existingCodes));
  
      setCode(`New Decryption Key: ${paddedCode}`);
    } catch (error) {
      console.error('Error generating code:', error);
      setError('Error: Could not generate code');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Decryption Key Generator</div>
      <div className={styles.content}>
        {/* Sidebar: Company List */}
        <div className={styles.sidebar}>
          {Object.keys(descriptions).map((companyName) => (
            <div
              key={companyName}
              className={`${styles.sidebarItem} ${selectedCompany === companyName ? styles.selected : ''}`}
              onClick={() => handleCompanyClick(companyName)}
            >
              {companyName}
            </div>
          ))}
        </div>
        {/* Main Content: Description Panel */}
        <div className={styles.main}>
          {selectedCompany && (
            <>
              <Image
                src={descriptions[selectedCompany].image}
                alt={selectedCompany}
                width={500} // Set appropriate width
                height={300} // Set appropriate height
              />
              <p>{descriptions[selectedCompany].text}</p>
            </>
          )}
        </div>
      </div>

      {/* Footer: Generate Code Button and Output */}
      <div className={styles.footer}>
        <button className={styles.button} onClick={generateCode}>
          Generate Code
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {code && <div className={styles.codeOutput}>{code}</div>}
      </div>
    </div>
  );
}