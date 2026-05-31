/* Online Email Extractor — popup component
   Renders a single Chrome-extension popup in one of three states:
     - "no-page"     : no active web page
     - "no-emails"   : page open, scan returned nothing
     - "has-emails"  : page open, grouped list of found addresses
   Header is constant. Width is 380px (standard popup).
*/

const POPUP_W = 380;

// ---------- Sample data ----------
const SAMPLE_GROUPS = [
{
  domain: "acme.co",
  emails: [
  "hello@acme.co",
  "press@acme.co",
  "jobs@acme.co",
  "sales@acme.co"]

},
{
  domain: "northwind.dev",
  emails: [
  "ada.lovelace@northwind.dev",
  "g.hopper@northwind.dev",
  "support@northwind.dev"]

},
{
  domain: "umbrella.io",
  emails: [
  "team@umbrella.io",
  "billing@umbrella.io"]

},
{
  domain: "globex.com",
  emails: [
  "info@globex.com",
  "careers@globex.com",
  "investors@globex.com",
  "hannibal@globex.com"]

},
{
  domain: "initech.net",
  emails: [
  "peter.gibbons@initech.net",
  "milton@initech.net"]

}];


// ---------- Header ----------
function PopupHeader() {
  return (
    <div className="oee-header">
      <div className="oee-logo" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2.5" y="5" width="19" height="14" rx="2.5"
          stroke="white" strokeWidth="1.8" />
          <path d="M3.5 7.2 L12 13 L20.5 7.2"
          stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18.5" cy="17.5" r="3.2" fill="#33b5e5" stroke="white" strokeWidth="1.4" />
          <path d="M16.9 17.5 L18.1 18.7 L20.1 16.4"
          stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      <div className="oee-titles">
        <div className="oee-title">Online Email Extractor</div>
        <div className="oee-subtitle">Find & export email addresses from any webpage</div>
      </div>
    </div>);

}

// ---------- Auto-scan toggle ----------
function AutoToggle({ on, onChange }) {
  return (
    <label className="oee-auto">
      <div className="oee-auto-text">
        <div className="oee-auto-label">Auto-scan mode</div>
        <div className="oee-auto-hint">
          {on ? "Automatically scanning every page you open" : "Off — scan only this page"}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={`oee-switch ${on ? "is-on" : ""}`}
        onClick={() => onChange(!on)}>
        
        <span className="oee-switch-thumb" />
      </button>
    </label>);

}

// ---------- State 1: No page ----------
function NoPageState() {
  return (
    <div className="oee-empty oee-empty--nopage">
      <div className="oee-empty-icon" aria-hidden="true">
        <i className="fa-regular fa-window-restore" />
      </div>
      <div className="oee-empty-title">No active page</div>
      <p className="oee-empty-text">Open a webpage in your browser, then click the extension icon again to scan the page for email addresses.

      </p>
      <div className="oee-empty-steps">
        <div className="oee-step">
          <span className="oee-step-num">1</span>
          <span>Open or switch to a tab</span>
        </div>
        <div className="oee-step">
          <span className="oee-step-num">2</span>
          <span>Click the icon in the toolbar</span>
        </div>
      </div>
    </div>);

}

// ---------- State 2.1: No emails ----------
function NoEmailsState({ pageHost }) {
  return (
    <>
      <div className="oee-pageinfo">
        <i className="fa-regular fa-file-lines oee-pageinfo-icon" />
        <div className="oee-pageinfo-host">{pageHost}</div>
        <span className="oee-pageinfo-status">Scanned</span>
      </div>
      <div className="oee-empty oee-empty--found">
        <div className="oee-empty-icon" aria-hidden="true">
          <i className="fa-regular fa-circle-question" />
        </div>
        <div className="oee-empty-title">No emails found on this page</div>
        <p className="oee-empty-text">We checked the visible content, links, and source code — no matches found. Try a contact page or scroll down, then rescan.

        </p>
        <button className="oee-btn oee-btn--text">
          <i className="fa-solid fa-rotate-right" />
          <span>RESCAN PAGE</span>
        </button>
      </div>
    </>);

}

// ---------- State 2.2: Has emails ----------
function HasEmailsState({ pageHost, groups, setGroups, killedEmails, setKilledEmails, killedDomains, setKilledDomains, onClear, copied, onAction }) {
  const totalEmails = groups.reduce((n, g) => n + g.emails.length, 0);
  const liveEmails = groups.reduce(
    (n, g) => n + (killedDomains.has(g.domain) ?
    0 :
    g.emails.filter((e) => !killedEmails.has(e)).length),
    0
  );

  const toggleEmail = (email) => {
    const s = new Set(killedEmails);
    s.has(email) ? s.delete(email) : s.add(email);
    setKilledEmails(s);
  };
  const toggleDomain = (domain) => {
    const s = new Set(killedDomains);
    s.has(domain) ? s.delete(domain) : s.add(domain);
    setKilledDomains(s);
  };

  return (
    <>
      <div className="oee-pageinfo">
        <i className="fa-regular fa-file-lines oee-pageinfo-icon" />
        <div className="oee-pageinfo-host">{pageHost}</div>
        <span className="oee-pageinfo-status oee-pageinfo-status--ok">
          {liveEmails} of {totalEmails}
        </span>
      </div>

      <div className="oee-summary">
        <div className="oee-summary-pill">
          <strong>{liveEmails}</strong>
          <span>emails</span>
        </div>
        <div className="oee-summary-pill oee-summary-pill--alt">
          <strong>{groups.length - [...killedDomains].length}</strong>
          <span>domains</span>
        </div>
        <div className="oee-summary-grow" />
        <button className="oee-iconbtn" title="Rescan page">
          <i className="fa-solid fa-rotate-right" />
        </button>
      </div>

      <div className="oee-list">
        {groups.map((g) => {
          const domDead = killedDomains.has(g.domain);
          const liveInGroup = domDead ?
          0 :
          g.emails.filter((e) => !killedEmails.has(e)).length;
          return (
            <section key={g.domain} className={`oee-group ${domDead ? "is-dead" : ""}`}>
              <header className="oee-group-head">
                <div className="oee-group-domain">
                  <i className="fa-solid fa-at oee-group-at" />
                  <span className="oee-group-name">{g.domain}</span>
                  <span className="oee-group-count">
                    {liveInGroup}/{g.emails.length}
                  </span>
                </div>
                <button
                  className="oee-strike oee-strike--domain"
                  onClick={() => toggleDomain(g.domain)}
                  title={domDead ? "Restore domain" : "Strike entire domain"}>
                  
                  {domDead ?
                  <><i className="fa-solid fa-rotate-left" /><span>Restore</span></> :

                  <><i className="fa-solid fa-eraser" /><span>Remove all</span></>
                  }
                </button>
              </header>
              <ul className="oee-group-emails">
                {g.emails.map((email) => {
                  const dead = domDead || killedEmails.has(email);
                  return (
                    <li
                      key={email}
                      className={`oee-email ${dead ? "is-dead" : ""}`}>
                      
                      <span className="oee-email-text">{email}</span>
                      <button
                        className="oee-strike"
                        onClick={() => !domDead && toggleEmail(email)}
                        disabled={domDead}
                        title={dead ? "Restore email" : "Strike email"}>
                        
                        <i className={`fa-solid ${dead ? "fa-rotate-left" : "fa-xmark"}`} />
                      </button>
                    </li>);

                })}
              </ul>
            </section>);

        })}
      </div>

      <footer className="oee-actions">
        <div className="oee-actions-row">
          <button className="oee-btn oee-btn--primary" onClick={() => onAction("csv")}>
            <i className="fa-solid fa-file-csv" />
            <span>Export CSV</span>
          </button>
          <button className="oee-btn oee-btn--secondary" onClick={() => onAction("txt")}>
            <i className="fa-regular fa-file-lines" />
            <span>Export TXT</span>
          </button>
          <button className="oee-btn oee-btn--secondary" onClick={() => onAction("copy")}>
            <i className={`fa-regular ${copied ? "fa-circle-check" : "fa-clipboard"}`} />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <button className="oee-btn oee-btn--ghost oee-btn--clear" onClick={onClear}>
          <i className="fa-regular fa-trash-can" />
          <span>Clear list</span>
        </button>
      </footer>
    </>);

}

// ---------- Main Popup ----------
function Popup({ state = "has-emails", pageHost = "techcrunch.com/contact", autoDefault = true, seed = SAMPLE_GROUPS }) {
  const [auto, setAuto] = React.useState(autoDefault);
  const [groups, setGroups] = React.useState(seed);
  const [killedEmails, setKilledEmails] = React.useState(new Set(["sales@acme.co"]));
  const [killedDomains, setKilledDomains] = React.useState(new Set(["initech.net"]));
  const [copied, setCopied] = React.useState(false);

  const handleClear = () => {
    setGroups([]);
    setKilledEmails(new Set());
    setKilledDomains(new Set());
  };

  const handleAction = (kind) => {
    if (kind === "copy") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="oee-popup" style={{ width: POPUP_W }}>
      <PopupHeader />
      {state === "no-page" ?
      <NoPageState /> :

      <div className="oee-body">
          <AutoToggle on={auto} onChange={setAuto} />
          {state === "no-emails" && <NoEmailsState pageHost={pageHost} />}
          {state === "has-emails" && groups.length > 0 &&
        <HasEmailsState
          pageHost={pageHost}
          groups={groups}
          setGroups={setGroups}
          killedEmails={killedEmails}
          setKilledEmails={setKilledEmails}
          killedDomains={killedDomains}
          setKilledDomains={setKilledDomains}
          onClear={handleClear}
          copied={copied}
          onAction={handleAction} />

        }
          {state === "has-emails" && groups.length === 0 &&
        <div className="oee-empty oee-empty--found">
              <div className="oee-empty-icon"><i className="fa-regular fa-square-check" /></div>
              <div className="oee-empty-title">List cleared</div>
              <p className="oee-empty-text">Rescan the page when you're ready to collect new email addresses.

          </p>
              <button className="oee-btn oee-btn--text" onClick={() => setGroups(SAMPLE_GROUPS)}>
                <i className="fa-solid fa-rotate-right" />
                <span>Rescan page</span>
              </button>
            </div>
        }
        </div>
      }
    </div>);

}

// ---------- Toolbar context (chrome bar with extension icon + badge) ----------
function ToolbarContext({ badge = 12 }) {
  return (
    <div className="oee-chrome">
      <div className="oee-chrome-bar">
        <div className="oee-chrome-dots">
          <span style={{ background: "#ff5f57" }} />
          <span style={{ background: "#febc2e" }} />
          <span style={{ background: "#28c840" }} />
        </div>
        <div className="oee-chrome-tab">
          <i className="fa-solid fa-lock" />
          <span>techcrunch.com/contact</span>
        </div>
        <div className="oee-chrome-grow" />
        <div className="oee-chrome-icons">
          <i className="fa-regular fa-star" />
          <i className="fa-solid fa-puzzle-piece" />
          <div className="oee-chrome-ext" title="Online Email Extractor">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2.5" y="5" width="19" height="14" rx="2.5"
              stroke="#1266F1" strokeWidth="1.8" />
              <path d="M3.5 7.2 L12 13 L20.5 7.2"
              stroke="#1266F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {badge > 0 && <span className="oee-chrome-badge">{badge > 99 ? "99+" : badge}</span>}
          </div>
          <div className="oee-chrome-avatar">M</div>
        </div>
      </div>
      <div className="oee-chrome-page">
        <div className="oee-chrome-stub"><span /><span /><span /></div>
        <div className="oee-chrome-stub"><span /><span /></div>
      </div>
      <div className="oee-chrome-popup-anchor">
        <div className="oee-chrome-arrow" />
        <Popup state="has-emails" />
      </div>
    </div>);

}

Object.assign(window, { Popup, ToolbarContext, SAMPLE_GROUPS });