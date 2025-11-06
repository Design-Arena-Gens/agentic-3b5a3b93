import { useMemo } from 'react';

type QuickCheck = {
  title: string;
  description: string;
  highlight: string;
};

type TroubleshootingStep = {
  title: string;
  description: string;
  items?: string[];
  nextActions?: string[];
};

type ResourceLink = {
  title: string;
  description: string;
  href: string;
};

const quickChecks: QuickCheck[] = [
  {
    title: 'Capture the Stop Code',
    description:
      'Note the stop code or error message shown on the BSOD screen (e.g., CRITICAL_PROCESS_DIED). It narrows the root cause dramatically.',
    highlight: 'Snap a photo before rebooting to preserve details.'
  },
  {
    title: 'Check Recent Changes',
    description:
      'Think about the latest drivers, Windows updates, or hardware you installed. Most BSODs surface right after a system change.',
    highlight: 'Roll back or uninstall the suspect change to see if stability returns.'
  },
  {
    title: 'Collect Dumps & Logs',
    description:
      'Ensure Windows is set to create minidumps (Control Panel → System → Advanced → Startup and Recovery). Logs make root-cause analysis possible.',
    highlight: 'Analyze dumps with WinDbg or upload to an analyzer like WhoCrashed.'
  }
];

const troubleshootingSteps: TroubleshootingStep[] = [
  {
    title: 'Run Startup Diagnostics',
    description: 'Boot into Windows Recovery Environment (WinRE) and run built-in repair tools.',
    items: [
      'Use Advanced Options → Startup Repair to fix bootloader corruption.',
      'Open Command Prompt → `sfc /scannow` and `DISM /Online /Cleanup-Image /RestoreHealth` for system file repairs.',
      'If the system fails to boot, use Safe Mode to isolate crashing startup drivers.'
    ]
  },
  {
    title: 'Stabilize Drivers & Firmware',
    description: 'Out-of-date or faulty drivers are responsible for the majority of BSODs.',
    items: [
      'Update storage, chipset, GPU, and network drivers directly from OEM websites.',
      'Roll back problematic driver updates from Device Manager when BSODs started after an update.',
      'Update BIOS/UEFI firmware to the latest stable release to resolve low-level incompatibilities.'
    ]
  },
  {
    title: 'Stress Test Memory & Storage',
    description: 'Hardware instability produces intermittent stop codes that appear random.',
    items: [
      'Run Windows Memory Diagnostic or MemTest86 overnight; replace RAM if errors appear.',
      'Use vendor SSD tools (Samsung Magician, Crucial Storage Executive) to check SMART health.',
      'Test with `chkdsk /scan` and manufacturer diagnostics to catch failing drives.'
    ]
  },
  {
    title: 'Check Thermals & Power Delivery',
    description: 'Thermal throttling or inadequate power rails cause BSODs under load.',
    items: [
      'Monitor temperatures with HWInfo64 or OpenHardwareMonitor while stressing CPU/GPU.',
      'Clean dust from heatsinks and ensure fans and pumps operate correctly.',
      'Verify PSU wattage headroom ≥ 20% of maximum draw; swap with a known-good PSU if in doubt.'
    ]
  },
  {
    title: 'Use Reliability Monitor & Event Viewer',
    description: 'Pinpoint patterns correlating crashes with specific drivers, services, or applications.',
    items: [
      'Reliability Monitor (search "Reliability History") offers a timeline of critical events.',
      'Event Viewer → Windows Logs → System, filter for "BugCheck" and "Kernel-Power" events.',
      'Double-click events for faulting modules and use the stop code to search Microsoft KB articles.'
    ]
  },
  {
    title: 'Escalate or Refresh Windows',
    description: 'When all else fails, isolate software from hardware or reinstall cleanly.',
    items: [
      'Perform an in-place upgrade install using the Windows 11/10 media creation tool to repair system files without losing data.',
      'If BSODs persist on a fresh OS, suspect hardware: test components individually or seek warranty service.',
      'Collect minidumps, system info (`msinfo32`), and driver list (`driverquery /v`) before opening a vendor support ticket.'
    ]
  }
];

const proactiveActions: string[] = [
  'Enable automatic minidump creation (Small memory dump) and configure a dedicated dump folder.',
  'Schedule weekly `sfc /scannow` and `DISM` health scans via Task Scheduler for mission-critical machines.',
  'Keep OEM drivers synchronized using vendor update utilities (e.g., Dell Command Update, Lenovo System Update).',
  'Document BIOS settings and keep a rollback plan before applying firmware updates.',
  'Back up system images with tools like Macrium Reflect before major Windows feature updates.'
];

const resources: ResourceLink[] = [
  {
    title: 'Microsoft BSOD Knowledge Base',
    description: 'Official stop code documentation and remediation guidance curated by Microsoft Support.',
    href: 'https://learn.microsoft.com/windows-hardware/drivers/debugger/bug-check-code-reference2'
  },
  {
    title: 'WinDbg Preview + Crash Dump Analysis',
    description: 'Step-by-step guide to install WinDbg, load symbols, and run `!analyze -v` against minidumps.',
    href: 'https://learn.microsoft.com/windows-hardware/drivers/debugger/debugger-download-tools'
  },
  {
    title: 'Windows Reliability Monitor Deep Dive',
    description: 'Understand reliability metrics and how to correlate crash signatures with software changes.',
    href: 'https://learn.microsoft.com/windows/win32/wmisdk/using-the-reliability-monitor'
  },
  {
    title: 'Hardware Diagnostics Checklist',
    description: 'Comprehensive workflow for memory, storage, GPU, and PSU validation before RMA replacement.',
    href: 'https://www.intel.com/content/www/us/en/support/articles/000005597/processors.html'
  }
];

const stopCodeCheatSheet = [
  {
    code: 'CRITICAL_PROCESS_DIED (0xEF)',
    advice: 'System process crashed unexpectedly. Run `sfc`, review startup drivers, and inspect minidumps for the faulting module.'
  },
  {
    code: 'IRQL_NOT_LESS_OR_EQUAL (0xA)',
    advice: 'Usually faulty drivers accessing invalid memory. Update chipset/network/storage drivers and review pool tags in WinDbg.'
  },
  {
    code: 'WHEA_UNCORRECTABLE_ERROR (0x124)',
    advice: 'Hardware error flagged by WHEA. Check CPU/GPU overclocks, thermals, and run manufacturer diagnostics.'
  },
  {
    code: 'SYSTEM_SERVICE_EXCEPTION (0x3B)',
    advice: 'Kernel-mode service threw an exception. Patch Windows, test third-party antivirus, and inspect recent driver installs.'
  },
  {
    code: 'PAGE_FAULT_IN_NONPAGED_AREA (0x50)',
    advice: 'Invalid memory access in nonpaged pool. Test RAM, inspect disk integrity, and verify driver memory usage with Driver Verifier.'
  }
];

function App() {
  const [firstQuickCheck, ...restQuickChecks] = useMemo(() => quickChecks, []);

  return (
    <main>
      <section className="hero">
        <article className="hero-card">
          <h1 className="hero-title">
            Resolve <span>Blue Screen of Death</span> Incidents with Confidence
          </h1>
          <p className="hero-summary">
            A structured troubleshooting playbook for Windows professionals and power users. Follow the diagnostic
            timeline, validate suspect drivers, and harden systems to stop recurring BSOD loops.
          </p>
        </article>
        <article className="hero-card">
          <h2 className="hero-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
            Quick Response Checklist
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '1rem' }}>
            <li>
              <strong>{firstQuickCheck.title}</strong>
              <p style={{ margin: '0.35rem 0 0', color: 'rgba(203, 213, 225, 0.8)' }}>{firstQuickCheck.description}</p>
              <em style={{ color: '#60a5fa', fontStyle: 'normal' }}>{firstQuickCheck.highlight}</em>
            </li>
            {restQuickChecks.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <p style={{ margin: '0.35rem 0 0', color: 'rgba(203, 213, 225, 0.8)' }}>{item.description}</p>
                <em style={{ color: '#60a5fa', fontStyle: 'normal' }}>{item.highlight}</em>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section">
        <header className="section-header">
          <h2>Structured Diagnostic Timeline</h2>
          <span className="badge">5-60 minute workflow</span>
        </header>
        <div className="timeline">
          {troubleshootingSteps.map((step) => (
            <article key={step.title} className="timeline-step">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {step.items && (
                <ul className="substeps">
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {step.nextActions && (
                <ul className="substeps">
                  {step.nextActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <header className="section-header">
          <h2>Stop Code Cheat Sheet</h2>
          <span className="badge">Most common crash signatures</span>
        </header>
        <div className="resources-grid">
          {stopCodeCheatSheet.map((item) => (
            <article key={item.code} className="resource-card">
              <strong>{item.code}</strong>
              <p>{item.advice}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <header className="section-header">
          <h2>Proactive Hardening Steps</h2>
          <span className="badge">Prevent repeat incidents</span>
        </header>
        <div className="timeline">
          {proactiveActions.map((action) => (
            <article key={action} className="timeline-step">
              <p>{action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <header className="section-header">
          <h2>Reference Resources</h2>
          <span className="badge">Dig deeper when needed</span>
        </header>
        <div className="resources-grid">
          {resources.map((resource) => (
            <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer" className="resource-card">
              <strong>{resource.title}</strong>
              <p>{resource.description}</p>
              <span style={{ color: '#93c5fd', fontSize: '0.9rem' }}>Open resource ↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>Need to escalate?</strong>
          <p style={{ margin: '0.4rem 0 0', color: 'rgba(203, 213, 225, 0.78)' }}>
            Collect minidumps, full system info, and timeline of changes before engaging Microsoft Premier Support or the
            OEM. A disciplined handoff shortens resolution time dramatically.
          </p>
        </div>
        <div>
          <strong>Disaster recovery tip</strong>
          <p style={{ margin: '0.4rem 0 0', color: 'rgba(203, 213, 225, 0.78)' }}>
            Keep a bootable USB toolkit (WinPE, MemTest86, storage diagnostics) ready. When BSODs transition into boot
            loops, offline tools are your lifeline.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;
