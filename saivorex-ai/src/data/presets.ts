import { CodeSamplePreset, OwaspItem } from '../types';

export const CODE_SAMPLE_PRESETS: CodeSamplePreset[] = [
  {
    id: 'sqli-python',
    title: 'SQL Injection in Python Flask',
    language: 'python',
    category: 'A03:2021 - Injection',
    description: 'Unsanitized user input directly concatenated into a raw SQL query inside Flask endpoint.',
    code: `from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/api/user_info', methods=['GET'])
def get_user_info():
    username = request.args.get('username')
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # VULNERABLE: Direct string interpolation allows SQL Injection
    query = f"SELECT id, username, email, role FROM users WHERE username = '{username}'"
    print("Executing query:", query)
    cursor.execute(query)
    user = cursor.fetchone()
    conn.close()
    if user:
        return jsonify({"id": user[0], "username": user[1], "email": user[2], "role": user[3]})
    return jsonify({"error": "User not found"}), 404
`
  },
  {
    id: 'xss-node',
    title: 'Reflected XSS in Express.js',
    language: 'javascript',
    category: 'A03:2021 - Injection',
    description: 'Directly rendering unescaped user input into HTML response without sanitization.',
    code: `import express from 'express';
const app = express();

app.get('/search', (req, res) => {
  const query = req.query.q || '';
  // VULNERABLE: Reflected Cross-Site Scripting (XSS)
  const htmlResponse = \`
    <!DOCTYPE html>
    <html>
      <head><title>Search Results</title></head>
      <body>
        <h1>Search Results for: \${query}</h1>
        <p>No matches found in database.</p>
      </body>
    </html>
  \`;
  res.send(htmlResponse);
});

app.listen(3000);
`
  },
  {
    id: 'ssrf-python',
    title: 'Server-Side Request Forgery (SSRF)',
    language: 'python',
    category: 'A10:2021 - Server-Side Request Forgery',
    description: 'Fetching remote image URL without validating host destination allowing internal metadata service access.',
    code: `import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/fetch-avatar', methods=['POST'])
def fetch_avatar():
    data = request.get_json()
    image_url = data.get('url')
    
    # VULNERABLE: SSRF - No URL scheme or IP address domain validation
    # An attacker can pass http://169.254.169.254/latest/meta-data/ to steal cloud credentials
    response = requests.get(image_url, timeout=5)
    return jsonify({
        "status": "success",
        "content_length": len(response.content),
        "data": response.text[:200]
    })
`
  },
  {
    id: 'hardcoded-secrets',
    title: 'Hardcoded API Secrets & JWT Verification Flaw',
    language: 'typescript',
    category: 'A07:2021 - Identification & Authentication Failures',
    description: 'Hardcoded JWT secret key and skipping token algorithm verification.',
    code: `import jwt from 'jsonwebtoken';

// VULNERABLE: Hardcoded JWT secret key stored directly in source control
const JWT_SECRET = "super_secret_admin_key_12345";

export function authenticateRequest(token: string) {
  try {
    // VULNERABLE: Allowing 'none' algorithm or weak verification
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256', 'none'] as any
    });
    return decoded;
  } catch (err) {
    return null;
  }
}
`
  },
  {
    id: 'path-traversal-php',
    title: 'Arbitrary File Read (Path Traversal)',
    language: 'php',
    category: 'A01:2021 - Broken Access Control',
    description: 'Reading server file path directly from query parameter without normalization.',
    code: `<?php
// VULNERABLE: Path Traversal
// Attacker can request: download.php?file=../../../../etc/passwd
$file = $_GET['file'];
$filepath = "/var/www/uploads/" . $file;

if (file_exists($filepath)) {
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="'.basename($filepath).'"');
    readfile($filepath);
    exit;
} else {
    echo "File not found.";
}
?>
`
  },
  {
    id: 'buffer-overflow-c',
    title: 'Buffer Overflow in C (strcpy / gets)',
    language: 'c',
    category: 'A03:2021 - Memory & Injection Flaws',
    description: 'Copying user input into a fixed-size stack buffer without boundary checking.',
    code: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void process_user_input(char *user_input) {
    char buffer[64];
    // VULNERABLE: strcpy does not check input bounds causing stack buffer overflow
    strcpy(buffer, user_input);
    printf("Processed input: %s\\n", buffer);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <input>\\n", argv[0]);
        return 1;
    }
    process_user_input(argv[1]);
    return 0;
}
`
  },
  {
    id: 'use-after-free-cpp',
    title: 'Use-After-Free Pointer Flaw in C++',
    language: 'cpp',
    category: 'A08:2021 - Software and Data Integrity Failures',
    description: 'Dangling pointer access after memory deallocation in C++ class instance.',
    code: `#include <iostream>
#include <cstring>

class UserSession {
public:
    char* username;
    UserSession(const char* name) {
        username = new char[strlen(name) + 1];
        strcpy(username, name);
    }
    ~UserSession() {
        delete[] username;
    }
    void printSession() {
        // VULNERABLE: Accessing memory after delete or dangling pointer dereference
        std::cout << "Active Session: " << username << std::endl;
    }
};

int main() {
    UserSession* session = new UserSession("admin_user");
    delete session; // Memory freed
    
    // VULNERABLE: Use-after-free execution
    session->printSession();
    return 0;
}
`
  },
  {
    id: 'insecure-deserialization-java',
    title: 'Insecure Object Deserialization in Java',
    language: 'java',
    category: 'A08:2021 - Software and Data Integrity Failures',
    description: 'Deserializing untrusted ObjectInputStream data leading to arbitrary code execution.',
    code: `import java.io.*;
import javax.servlet.http.*;

public class UserSessionServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            InputStream is = request.getInputStream();
            // VULNERABLE: Deserializing untrusted input stream without class filtering
            ObjectInputStream ois = new ObjectInputStream(is);
            Object object = ois.readObject();
            
            response.getWriter().println("Session loaded for: " + object.toString());
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
`
  },
  {
    id: 'xxe-csharp',
    title: 'XML External Entity (XXE) in C# .NET',
    language: 'csharp',
    category: 'A05:2021 - Security Misconfiguration',
    description: 'XmlDocument reader configured with DtdProcessing.Parse allowing local file disclosure.',
    code: `using System;
using System.Xml;

namespace SecurityAuditApp
{
    public class XmlProcessor
    {
        public static void ProcessUserData(string xmlPayload)
        {
            XmlDocument xmlDoc = new XmlDocument();
            // VULNERABLE: Enabling DTD parsing and external entity resolution
            XmlReaderSettings settings = new XmlReaderSettings();
            settings.DtdProcessing = DtdProcessing.Parse;
            settings.XmlResolver = new XmlUrlResolver();

            using (XmlReader reader = XmlReader.Create(new System.IO.StringReader(xmlPayload), settings))
            {
                xmlDoc.Load(reader);
                Console.WriteLine("Parsed XML Root: " + xmlDoc.DocumentElement.Name);
            }
        }
    }
}
`
  },
  {
    id: 'command-injection-go',
    title: 'Command Injection in Go (Golang)',
    language: 'go',
    category: 'A03:2021 - Injection',
    description: 'Passing unsanitized web request parameter directly to sh -c shell command execution.',
    code: `package main

import (
	"fmt"
	"net/http"
	"os/exec"
)

func pingHandler(w http.ResponseWriter, r *http.Request) {
	targetHost := r.URL.Query().Get("host")
	
	// VULNERABLE: Concatenating untrusted parameter into shell command
	cmdStr := fmt.Sprintf("ping -c 1 %s", targetHost)
	out, err := exec.Command("sh", "-c", cmdStr).CombinedOutput()
	
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Write(out)
}

func main() {
	http.HandleFunc("/api/ping", pingHandler)
	http.ListenAndServe(":8080", nil)
}
`
  },
  {
    id: 'unsafe-memory-rust',
    title: 'Unsafe Memory Pointer Dereference in Rust',
    language: 'rust',
    category: 'A08:2021 - Software and Data Integrity Failures',
    description: 'Bypassing Rust borrow checker safety with unsafe raw pointer dereference.',
    code: `fn main() {
    let mut num: i32 = 42;
    let r1 = &num as *const i32;
    
    unsafe {
        // VULNERABLE: Unchecked raw pointer dereference without bounds or lifetime verification
        let val = *r1;
        println!("Value at raw pointer: {}", val);
        
        let invalid_ptr = 0x12345678 as *const i32;
        println!("Invalid memory access: {}", *invalid_ptr);
    }
}
`
  },
  {
    id: 'eval-injection-ruby',
    title: 'Remote Code Execution via Eval in Ruby',
    language: 'ruby',
    category: 'A03:2021 - Injection',
    description: 'Executing dynamic string evaluation from HTTP request parameter in Ruby on Rails.',
    code: `class CalculatorController < ApplicationController
  def calculate
    expression = params[:expr]
    # VULNERABLE: Direct eval execution allows arbitrary Ruby code execution
    result = eval(expression)
    render json: { status: "success", result: result }
  rescue StandardError => e
    render json: { error: e.message }, status: 400
  end
end
`
  },
  {
    id: 'dynamic-sql-sql',
    title: 'Raw Dynamic SQL Stored Procedure Injection',
    language: 'sql',
    category: 'A03:2021 - Injection',
    description: 'Executing EXECUTE IMMEDIATE or sp_executesql with unescaped string variables.',
    code: `CREATE PROCEDURE GetCustomerOrders
    @CustomerName NVARCHAR(100)
AS
BEGIN
    DECLARE @DynamicSQL NVARCHAR(MAX);
    -- VULNERABLE: String concatenation inside T-SQL dynamic query
    SET @DynamicSQL = 'SELECT OrderID, OrderDate, TotalAmount FROM Orders WHERE CustomerName = ''' + @CustomerName + '''';
    
    PRINT @DynamicSQL;
    EXEC sp_executesql @DynamicSQL;
END;
`
  }
];

export const OWASP_TOP_10: OwaspItem[] = [
  {
    id: 'A01:2021',
    name: 'Broken Access Control',
    title: 'A01:2021 - Broken Access Control',
    description: 'Restrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access unauthorized functionality, user accounts, sensitive files, or administrative controls.',
    impact: 'High / Critical - Unauthorized privilege escalation, data exfiltration, or complete system takeover.',
    vulnerableCodeSample: `// Express.js vulnerable IDOR endpoint
app.get('/api/user/:id/profile', async (req, res) => {
  // Missing authorization check against req.user.id!
  const user = await db.findUserById(req.params.id);
  res.json(user);
});`,
    secureCodeSample: `// Express.js secure access control check
app.get('/api/user/:id/profile', authenticateToken, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const user = await db.findUserById(req.params.id);
  res.json(user);
});`,
    preventionSteps: [
      'Deny access by default (Principle of Least Privilege).',
      'Implement central access control checks per endpoint.',
      'Enforce ownership checks on records (IDOR protection).',
      'Disable directory listing on web servers.'
    ],
    cweReferences: ['CWE-200', 'CWE-284', 'CWE-639']
  },
  {
    id: 'A02:2021',
    name: 'Cryptographic Failures',
    title: 'A02:2021 - Cryptographic Failures',
    description: 'Failures related to cryptography (previously known as Sensitive Data Exposure), which often leads to sensitive data exposure or key compromise.',
    impact: 'High - Exposure of PII, passwords, session tokens, or financial records.',
    vulnerableCodeSample: `// Weak hashing with MD5
const crypto = require('crypto');
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}`,
    secureCodeSample: `// Strong password hashing with Argon2 or bcrypt with salt
const bcrypt = require('bcrypt');
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}`,
    preventionSteps: [
      'Classify data processed by the application and identify sensitive items.',
      'Encrypt data in transit using TLS 1.3 with strong ciphers.',
      'Use strong password hashing algorithms like Argon2id or bcrypt.',
      'Store keys securely in hardware or managed key vaults (KMS).'
    ],
    cweReferences: ['CWE-327', 'CWE-311', 'CWE-326']
  },
  {
    id: 'A03:2021',
    name: 'Injection',
    title: 'A03:2021 - Injection',
    description: 'An application is vulnerable to injection when user-supplied data is not validated, filtered, or sanitized by the application before execution.',
    impact: 'Critical - Data exposure, data corruption, or Remote Code Execution (RCE).',
    vulnerableCodeSample: `query = f"SELECT * FROM users WHERE email = '{user_email}'"`,
    secureCodeSample: `query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (user_email,))`,
    preventionSteps: [
      'Use parameterized queries / ORM prepared statements.',
      'Use positive server-side input validation (allowlists).',
      'Escape special characters for interpreter context.'
    ],
    cweReferences: ['CWE-89', 'CWE-79', 'CWE-78', 'CWE-94']
  },
  {
    id: 'A04:2021',
    name: 'Insecure Design',
    title: 'A04:2021 - Insecure Design',
    description: 'A new category for 2021 focusing on risks related to design and architectural flaws, requiring threat modeling and secure design patterns.',
    impact: 'High - Fundamental architectural flaws that cannot be fixed by simple code patches.',
    vulnerableCodeSample: `// Unlimited password reset attempts without rate limiting or captcha`,
    secureCodeSample: `// Architectural rate-limiter, multi-factor verification token with strict expiration`,
    preventionSteps: [
      'Establish a secure development lifecycle with threat modeling.',
      'Integrate security design patterns and reference architectures.',
      'Enforce rate limiting and brute force countermeasures.'
    ],
    cweReferences: ['CWE-209', 'CWE-256', 'CWE-522']
  },
  {
    id: 'A05:2021',
    name: 'Security Misconfiguration',
    title: 'A05:2021 - Security Misconfiguration',
    description: 'Missing security hardening across application stacks, default credentials, verbose error messages, or overly permissive CORS.',
    impact: 'Medium to High - Information disclosure, unauthenticated admin access.',
    vulnerableCodeSample: `app.use(cors({ origin: '*' }));
// Debug mode enabled in production exposing full stack trace
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});`,
    secureCodeSample: `app.use(cors({ origin: 'https://trusted-domain.com' }));
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});`,
    preventionSteps: [
      'Implement automated configuration audits and infrastructure as code.',
      'Remove unused features, frameworks, and sample code.',
      'Configure Security Response Headers (CSP, HSTS, X-Frame-Options).'
    ],
    cweReferences: ['CWE-16', 'CWE-2', 'CWE-1004']
  },
  {
    id: 'A06:2021',
    name: 'Vulnerable & Outdated Components',
    title: 'A06:2021 - Vulnerable and Outdated Components',
    description: 'Using components with known vulnerabilities (e.g. Log4j, outdated npm or PyPI packages) that compromise application security.',
    impact: 'High to Critical - Known exploit scripts available publicly.',
    vulnerableCodeSample: `// package.json with outdated vulnerable dependencies
"dependencies": {
  "lodash": "4.17.15",
  "express": "4.15.0"
}`,
    secureCodeSample: `// Automated dependency scanning via Dependabot / npm audit / Snyk
"dependencies": {
  "express": "^4.21.2"
}`,
    preventionSteps: [
      'Remove unused dependencies, components, files, and documentation.',
      'Continuously inventory client-side and server-side dependencies.',
      'Subscribe to security alerts for used libraries.'
    ],
    cweReferences: ['CWE-1104', 'CWE-937']
  },
  {
    id: 'A07:2021',
    name: 'Identification & Auth Failures',
    title: 'A07:2021 - Identification & Authentication Failures',
    description: 'Permitting automated credential stuffing, brute force, weak password policies, or insecure session token lifecycle.',
    impact: 'Critical - Account takeover, identity theft.',
    vulnerableCodeSample: `if (user.password === req.body.password) {
  res.cookie('session', user.id); // Insecure cookie without HttpOnly/Secure flags
}`,
    secureCodeSample: `const match = await bcrypt.compare(req.body.password, user.passwordHash);
if (match) {
  res.cookie('session', sessionToken, { httpOnly: true, secure: true, sameSite: 'strict' });
}`,
    preventionSteps: [
      'Implement multi-factor authentication (MFA).',
      'Do not ship with default credentials.',
      'Implement brute-force protections and login rate limiting.'
    ],
    cweReferences: ['CWE-287', 'CWE-384', 'CWE-798']
  },
  {
    id: 'A08:2021',
    name: 'Software & Data Integrity Failures',
    title: 'A08:2021 - Software and Data Integrity Failures',
    description: 'Code and infrastructure that does not protect against integrity violations (e.g., untrusted CI/CD pipelines, untrusted auto-updates, insecure deserialization).',
    impact: 'Critical - Arbitrary code execution during object deserialization or supply chain attacks.',
    vulnerableCodeSample: `// Python pickle unsafe load
import pickle
user_data = pickle.loads(untrusted_user_bytes)`,
    secureCodeSample: `// Use safe structured formats like JSON
import json
user_data = json.loads(untrusted_user_string)`,
    preventionSteps: [
      'Use digital signatures or hash checksums to verify software updates.',
      'Ensure CI/CD build pipelines have segregated access controls.',
      'Never pass untrusted data directly to deserialization engines.'
    ],
    cweReferences: ['CWE-502', 'CWE-829', 'CWE-494']
  },
  {
    id: 'A09:2021',
    name: 'Security Logging & Monitoring Failures',
    title: 'A09:2021 - Security Logging & Monitoring Failures',
    description: 'Insufficient logging, detection, monitoring, and active response enables attackers to maintain persistence, escalate access, and pivot through systems.',
    impact: 'High - Delayed incident detection (average dwell time > 200 days).',
    vulnerableCodeSample: `try {
  authenticateUser();
} catch (e) {
  // Silent fail without logging security event
}`,
    secureCodeSample: `try {
  authenticateUser();
} catch (e) {
  logger.warn('Failed login attempt', { ip: req.ip, timestamp: new Date(), userId });
}`,
    preventionSteps: [
      'Log all audit events (e.g. failed logins, access control failures).',
      'Ensure logs are formatted for SIEM centralized analysis.',
      'Establish effective monitoring and incident response alerts.'
    ],
    cweReferences: ['CWE-778', 'CWE-117']
  },
  {
    id: 'A10:2021',
    name: 'Server-Side Request Forgery',
    title: 'A10:2021 - Server-Side Request Forgery (SSRF)',
    description: 'SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL.',
    impact: 'High to Critical - Internal network scanning, cloud metadata credential extraction, internal service exploitation.',
    vulnerableCodeSample: `fetch(req.query.targetUrl).then(r => r.text());`,
    secureCodeSample: `const parsed = new URL(req.query.targetUrl);
if (!ALLOWED_DOMAINS.includes(parsed.hostname) || isInternalIP(parsed.hostname)) {
  throw new Error('Blocked target domain');
}`,
    preventionSteps: [
      'Enforce strict domain allowlists for outbound connections.',
      'Disable HTTP redirects.',
      'Block access to internal IP ranges (127.0.0.1, 10.0.0.0/8, 169.254.169.254).'
    ],
    cweReferences: ['CWE-918']
  }
];
