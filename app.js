const icons = {
  dashboard: '<svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10ZM13 21h8V11h-8v10ZM13 3v6h8V3h-8ZM3 21h8v-6H3v6Z"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  wallet: '<svg viewBox="0 0 24 24"><path d="M20 7H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h13M16 15h.01"/></svg>',
  loan: '<svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
  receipt: '<svg viewBox="0 0 24 24"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .67V2l-3 2-3-2-3 2-3-2-3 2-3-2ZM8 8h8M8 12h8M8 16h5"/></svg>',
  report: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18M8 17V9M13 17V5M18 17v-3"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><path d="M6 10V8a6 6 0 0 1 12 0v2M5 10h14v11H5V10Z"/></svg>',
  eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24"><path d="m3 3 18 18M10.6 10.6A2 2 0 0 0 13.4 13.4M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.1 3.1M6.6 6.6C3.5 8.5 2 12 2 12s3.5 8 10 8a9.8 9.8 0 0 0 4.1-.9"/></svg>',
  search: '<svg viewBox="0 0 24 24"><path d="m21 21-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  user: '<svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/></svg>',
};

const adminNavItems = [
  ["dashboard", "Dashboard", icons.dashboard],
  ["members", "Members", icons.users],
  ["memberForm", "Add Member", icons.user],
  ["memberProfile", "Member Profile", icons.file],
  ["accounts", "Savings / Accounts", icons.wallet],
  ["deposit", "Deposit", icons.wallet],
  ["withdrawal", "Withdrawal", icons.receipt],
  ["loans", "Loans", icons.loan],
  ["loanApplication", "Loan Application", icons.file],
  ["loanApproval", "Approvals", icons.shield],
  ["loanDetails", "Loan Details", icons.file],
  ["transactions", "Transactions", icons.receipt],
  ["reports", "Reports", icons.report],
  ["users", "User Management", icons.shield],
  ["logout", "Logout", icons.lock],
];

const memberNavItems = [
  ["memberDashboard", "Dashboard", icons.dashboard],
  ["memberSavings", "Savings", icons.wallet],
  ["memberLoans", "Loans", icons.loan],
  ["memberProfile", "Profile", icons.user],
];

let members = [
  ["ZS-1001", "Amina Kato", "Kampala Central", "UGX 18.2M", "2", "Active"],
  ["ZS-1002", "Brian Okello", "Wandegeya", "UGX 7.8M", "1", "Active"],
  ["ZS-1003", "Claire Namuli", "Mukono", "UGX 25.4M", "0", "Active"],
  ["ZS-1004", "David Ssebugwawo", "Entebbe", "UGX 4.6M", "1", "Review"],
  ["ZS-1005", "Esther Achieng", "Jinja", "UGX 13.9M", "3", "Active"],
];

let transactions = [
  ["TX-88291", "Amina Kato", "Deposit", "UGX 2,000,000", "Apr 30, 2026", "Completed"],
  ["TX-88288", "Brian Okello", "Loan repayment", "UGX 620,000", "Apr 29, 2026", "Completed"],
  ["TX-88276", "Claire Namuli", "Withdrawal", "UGX 1,150,000", "Apr 28, 2026", "Approved"],
  ["TX-88261", "Esther Achieng", "Deposit", "UGX 4,500,000", "Apr 27, 2026", "Completed"],
  ["TX-88244", "David Ssebugwawo", "Loan disbursement", "UGX 8,000,000", "Apr 26, 2026", "Posted"],
];

let loanRows = [
  ["LN-2041", "Amina Kato", "Business Expansion", "UGX 12,000,000", "62%", "Performing"],
  ["LN-2038", "Brian Okello", "School Fees", "UGX 3,500,000", "78%", "Performing"],
  ["LN-2031", "David Ssebugwawo", "Asset Finance", "UGX 8,000,000", "24%", "Watch"],
  ["LN-2026", "Esther Achieng", "Agriculture", "UGX 16,000,000", "41%", "Performing"],
];

let staffRows = [
  ["Grace Nambi", "Admin", "Head Office", "Full access", "Active"],
  ["Samuel Kizza", "Manager", "Kampala Central", "Approvals", "Active"],
  ["Ruth Akello", "Teller", "Wandegeya", "Transactions", "Active"],
  ["Peter Mwanga", "Teller", "Mukono", "Transactions", "Suspended"],
];

let memberRecords = [];
let accountRecords = [
  { id: "demo-account-1", accountNumber: "ZS-SAV-1001", memberName: "Amina Kato", accountType: "Savings", balance: 18240000, lastActivity: "Apr 30, 2026", status: "Active" },
  { id: "demo-account-2", accountNumber: "ZS-SHR-1001", memberName: "Amina Kato", accountType: "Shares", balance: 3400000, lastActivity: "Apr 18, 2026", status: "Active" },
  { id: "demo-account-3", accountNumber: "ZS-SAV-1002", memberName: "Brian Okello", accountType: "Savings", balance: 7800000, lastActivity: "Apr 29, 2026", status: "Active" },
  { id: "demo-account-4", accountNumber: "ZS-SAV-1004", memberName: "David Ssebugwawo", accountType: "Savings", balance: 4600000, lastActivity: "Apr 26, 2026", status: "Review" },
];
let transactionRecords = [];
let loanRecords = [];
let staffRecords = [];
let liveSacco = null;
let appSummary = {
  totalMembers: members.length,
  totalAccounts: accountRecords.length,
  totalSavings: accountRecords.reduce((sum, account) => sum + Number(account.balance || 0), 0),
  activeLoans: loanRows.filter((loan) => loan[5] !== "Rejected").length,
  totalTransactions: transactions.length,
};

const adminAccounts = [
  { name: "Amina Kato", email: "admin@zsacco.coop", password: "zsacco", memberName: "Amina Kato", memberPassword: "Member2026!" },
  { name: "Grace Nambi", email: "grace@zsacco.coop", password: "Grace2026!", memberName: "Grace Nambi", memberPassword: "Member2026!" },
  { name: "Samuel Kizza", email: "samuel@zsacco.coop", password: "Samuel2026!", memberName: "Samuel Kizza", memberPassword: "Member2026!" },
];

const memberAccounts = [
  { name: "Amina Kato", memberId: "ZS-1001", saccoRegistration: "ZS-SACCO-2026-100001", password: "Member2026!" },
  { name: "Brian Okello", memberId: "ZS-1002", saccoRegistration: "ZS-SACCO-2026-100001", password: "Brian2026!" },
  { name: "Claire Namuli", memberId: "ZS-1003", saccoRegistration: "ZS-SACCO-2026-100001", password: "Claire2026!" },
];

const featureDetails = {
  members: ["Member Management", "Open a full member record with KYC information, savings accounts, transaction history, loans, and member status in one organized profile."],
  savings: ["Savings & Accounts", "Record deposits and withdrawals, view balances, print receipts, and keep member savings activity traceable across branches."],
  loans: ["Loan Management", "Capture applications, review approvals, track repayment progress, and monitor the loan portfolio from application to closure."],
  reports: ["Reports & Statements", "Generate financial summaries, export transaction histories, and prepare member statements for transparency and audits."],
};

let currentAdminScreen = "adminLogin";
let currentMemberScreen = "memberDashboard";
let selectedTransaction = transactions[0];
let selectedLoan = loanRows[0];
let selectedMember = null;
let editingMember = null;
let toastTimer;
let lastSaccoRegistration = "ZS-SACCO-2026-100001";
let currentSessionRole = null;
let currentSessionUser = null;
let authToken = null;
let uploadedKycDocuments = [];

const appFrame = document.querySelector("#appFrame");
const portalFrame = document.querySelector("#portalFrame");
const publicSite = document.querySelector("#publicSite");
const adminContent = document.querySelector("#adminContent");
const memberContent = document.querySelector("#memberContent");
const sectionLabel = document.querySelector("#sectionLabel");
const pageTitle = document.querySelector("#pageTitle");

function moneyStat(title, value, change, icon) {
  return `<article class="card stat-card">
    <div class="card-title"><span class="stat-icon">${icon}</span><span class="delta">${change}</span></div>
    <div><p class="muted">${title}</p><p class="metric">${value}</p></div>
  </article>`;
}

function renderTable(headers, rows, action = "View") {
  return `<div class="table-wrap"><table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}<th>Action</th></tr></thead>
    <tbody>${rows.map((row) => `<tr>${row.map((cell) => {
      const status = String(cell).toLowerCase();
      if (["active", "completed", "approved", "posted", "performing"].includes(status)) return `<td><span class="pill success">${cell}</span></td>`;
      if (["review", "watch", "suspended"].includes(status)) return `<td><span class="pill warn">${cell}</span></td>`;
      if (String(cell).includes("%")) return `<td><div class="progress"><span style="width:${cell}"></span></div><small>${cell}</small></td>`;
      return `<td>${cell}</td>`;
    }).join("")}<td><button class="ghost-button table-action">${action}</button></td></tr>`).join("")}</tbody>
  </table></div>`;
}

function avatarMarkup(name, photo, className = "avatar") {
  if (photo) return `<span class="${className} photo-avatar"><img src="${photo}" alt="${name || "Member"} photo" /></span>`;
  return `<span class="${className}">${String(name || "ZS").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>`;
}

function toolbar(searchPlaceholder, filters = []) {
  return `<div class="toolbar">
    <div class="field" style="min-width:260px"><input id="tableSearch" placeholder="${searchPlaceholder}" /></div>
    ${filters.map((f) => `<select><option>${f}</option></select>`).join("")}
    <button class="ghost-button">${icons.search} Filter</button>
  </div>`;
}

const chartPalette = ["#e0aa17", "#f6d86d", "#987315", "#d0d4dc", "#6f5400"];

function savingsMovementSeries(records, monthCount = 8) {
  const now = new Date();
  const months = Array.from({ length: monthCount }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleDateString("en-UG", { month: "short" }),
      year: date.getFullYear(),
      amount: 0,
    };
  });
  const byMonth = new Map(months.map((item) => [item.key, item]));

  records.forEach((transaction) => {
    const date = new Date(transaction.date || transaction.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const bucket = byMonth.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (!bucket) return;
    const type = String(transaction.transactionType || "").toLowerCase();
    const amount = Number(transaction.amount || 0);
    if (/deposit|saving|contribution/.test(type)) bucket.amount += amount;
    if (/withdrawal/.test(type)) bucket.amount -= amount;
  });

  return months;
}

function loanPortfolioSeries(records) {
  const totals = records.reduce((map, loan) => {
    const status = String(loan.status || "").toLowerCase();
    if (["rejected", "closed"].includes(status)) return map;
    const product = String(loan.product || "General loan").trim() || "General loan";
    const amount = Number(loan.approvedAmount || 0) > 0
      ? Number(loan.approvedAmount)
      : Number(loan.requestedAmount || 0);
    if (amount > 0) map[product] = (map[product] || 0) + amount;
    return map;
  }, {});
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (sorted.length <= 4) return sorted;
  return [...sorted.slice(0, 4), ["Other loans", sorted.slice(4).reduce((sum, entry) => sum + entry[1], 0)]];
}

function dashboard() {
  const totalSavings = accountRecords.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  const activeLoans = loanRecords.filter((loan) => String(loan.status || "").toLowerCase() !== "rejected").length || loanRows.length;
  const approvedLoans = loanRecords.filter((loan) => String(loan.status || "").toLowerCase() === "performing").length;
  const recentToday = transactionRecords.filter((transaction) => formatDate(transaction.date) === todayLabel()).length;
  const savingsBars = savingsMovementSeries(transactionRecords);
  const maxMovement = Math.max(...savingsBars.map((item) => Math.abs(item.amount)), 1);
  const hasSavingsActivity = savingsBars.some((item) => item.amount !== 0);
  const productLegend = loanPortfolioSeries(loanRecords);
  const productTotal = productLegend.reduce((sum, entry) => sum + entry[1], 0);
  let donutCursor = 0;
  const donutStops = productLegend.map((entry, index) => {
    const start = donutCursor;
    donutCursor += productTotal ? (entry[1] / productTotal) * 100 : 0;
    return `${chartPalette[index]} ${start.toFixed(2)}% ${donutCursor.toFixed(2)}%`;
  });
  const donutBackground = productTotal
    ? `conic-gradient(${donutStops.join(",")})`
    : "#30332c";
  return `<div class="screen">
    <section class="grid stats-grid">
      ${moneyStat("Total Members", members.length.toLocaleString(), "Live member register", icons.users)}
      ${moneyStat("Total Savings", formatUGX(totalSavings, true), "From savings accounts", icons.wallet)}
      ${moneyStat("Active Loans", activeLoans.toLocaleString(), `+${approvedLoans} approved`, icons.loan)}
      ${moneyStat("Total Transactions", transactions.length.toLocaleString(), `+${recentToday} today`, icons.receipt)}
    </section>
    <section class="grid two-col">
      <article class="card">
        <div class="card-title"><div><h2>Savings Growth</h2><small class="chart-subtitle">Net deposits minus withdrawals</small></div><span class="pill">Live data</span></div>
        <div class="chart ${hasSavingsActivity ? "" : "chart-no-data"}">${savingsBars.map((item) => {
          const height = item.amount ? Math.max(8, Math.round((Math.abs(item.amount) / maxMovement) * 100)) : 2;
          const signedAmount = `${item.amount >= 0 ? "+" : "-"}${formatUGX(Math.abs(item.amount), true)}`;
          return `<div class="bar ${item.amount < 0 ? "negative" : ""} ${item.amount === 0 ? "is-empty" : ""}" title="${item.month} ${item.year}: ${signedAmount}"><strong>${item.amount ? signedAmount : "—"}</strong><span style="height:${height}%"></span>${item.month}</div>`;
        }).join("")}</div>
      </article>
      <article class="card">
        <div class="card-title"><div><h2>Loan Distribution</h2><small class="chart-subtitle">By active portfolio amount</small></div><span class="pill dark">Live data</span></div>
        <div class="donut-wrap">
          <div class="donut" style="background:${donutBackground}"><span>${productTotal ? formatUGX(productTotal, true) : "UGX 0"}<small>Total</small></span></div>
          <div class="legend">
            ${(productLegend.length ? productLegend : [["No active loans", 0]]).map(([name, amount], index) => `<p><span style="background:${chartPalette[index] || chartPalette[0]}"></span><strong>${name}</strong><small>${formatUGX(amount, true)} · ${productTotal ? Math.round((amount / productTotal) * 100) : 0}%</small></p>`).join("")}
          </div>
        </div>
      </article>
    </section>
    <section class="grid two-col">
      <article class="table-card">
        <div class="table-head"><h2 class="section-title">Recent Transactions</h2><button class="ghost-button" data-screen="transactions">Open history</button></div>
        ${renderTable(["Ref", "Member", "Type", "Amount", "Date", "Status"], transactions.slice(0, 4), "Details")}
      </article>
      <article class="card">
        <div class="card-title"><h2>Recent Activity</h2><span class="pill success">Live</span></div>
        <div class="activity">
          ${(transactions.length ? transactions.slice(0, 3).map((row) => `<div class="activity-item"><span class="status-dot"></span><div><strong>${row[2]} posted</strong><br><small>${row[1]}, ${row[3]}</small></div></div>`).join("") : '<div class="empty-state">No activity yet.</div>')}
          ${(loanRows[0] ? `<div class="activity-item"><span class="status-dot warn"></span><div><strong>Latest loan update</strong><br><small>${loanRows[0][1]}, ${loanRows[0][2]}</small></div></div>` : "")}
        </div>
      </article>
    </section>
  </div>`;
}

function authScreen(type) {
  const isMember = type === "member";
  const rememberedAdmin = localStorage.getItem("zsacco_remembered_admin") || "admin@zsacco.coop";
  const rememberedMember = localStorage.getItem("zsacco_remembered_member") || lastSaccoRegistration;
  const signinFields = isMember
    ? `<div class="field"><label>SACCO registration number, member ID, or member name</label><input name="member_identity" value="${rememberedMember}" /></div>
       <div class="field"><label>Member password</label><div class="password-control"><input name="member_password" type="password" value="Member2026!" /><button class="password-toggle" type="button" data-toggle-password aria-label="Show password" aria-pressed="false">${icons.eye}</button></div></div>
       <div class="security-note full"><strong>Member access</strong><span>Members use the SACCO registration number, member ID, or registered name with a private password set for the member portal.</span></div>`
    : `<div class="field"><label>Email address</label><input name="admin_email" value="${rememberedAdmin}" /></div>
       <div class="field"><label>Password</label><div class="password-control"><input name="admin_password" type="password" value="zsacco" /><button class="password-toggle" type="button" data-toggle-password aria-label="Show password" aria-pressed="false">${icons.eye}</button></div></div>`;
  return `<section class="auth-screen">
    <div class="auth-art-card">
      <div class="auth-welcome">
        <div class="auth-brand-row">
          <span class="brand-hero-mark"><img src="assets/z-sacco-gold-mark.png" alt="" /></span>
          <span>
            <strong>Z-SACCO</strong>
            <small>Management System</small>
          </span>
        </div>
        <p class="eyebrow">Secure SACCO platform</p>
        <h1>Welcome!</h1>
        <span class="gold-rule"></span>
        <p>${isMember ? "Access your savings balance, loans, repayments, and personal details in a protected member portal." : "Operate member savings, loans, reports, and branch activity through a secure financial cooperative workspace."}</p>
        <button class="gold-button" type="button" data-auth-tab="signup">Create account</button>
      </div>
      <form class="auth-card auth-glass" data-auth-panel="signin">
        <div class="auth-tabs">
          <button class="active" type="button" data-auth-tab="signin">Sign in</button>
          <button type="button" data-auth-tab="signup">Sign up</button>
        </div>
        <h2>${isMember ? "Member Login" : "Staff Login"}</h2>
        <div class="grid">
          <div class="auth-role-switch full">
            <button class="${isMember ? "" : "active"}" type="button" data-login-role="admin">Admin</button>
            <button class="${isMember ? "active" : ""}" type="button" data-login-role="member">Member</button>
          </div>
          ${signinFields}
          <div class="split-actions"><label><input name="remember_device" type="checkbox" style="width:auto;min-height:auto" checked /> Remember device</label><button class="link-button" type="button" data-forgot-password="${isMember ? "member" : "admin"}">Forgot password?</button></div>
          <button class="gold-submit" type="button" data-login-submit="${isMember ? "member" : "admin"}">${icons.lock} Sign in securely</button>
          <button class="glass-link" type="button" data-switch="${isMember ? "admin" : "member"}">${isMember ? "Staff back office" : "Member portal"}</button>
        </div>
      </form>
      <form class="auth-card auth-glass hidden" data-auth-panel="signup">
        <div class="auth-tabs">
          <button type="button" data-auth-tab="signin">Sign in</button>
          <button class="active" type="button" data-auth-tab="signup">Sign up</button>
        </div>
        <h2>Create SACCO Account</h2>
        <div class="grid">
          <div class="field"><label>SACCO name</label><input name="sacco_name" value="Kampala Traders SACCO" required /></div>
          <div class="field"><label>SACCO phone number</label><input name="sacco_phone" value="+256 701 000 000" required /></div>
          <div class="field"><label>SACCO email address</label><input name="sacco_email" type="email" value="info@kampalatraders.coop" required /></div>
          <div class="field"><label>Main branch / location</label><input name="location" value="Kampala, Uganda" /></div>
          <div class="field"><label>Number of members</label><input name="members_count" value="250" /></div>
          <div class="field"><label>Owner / admin full name</label><input name="owner_name" value="Amina Kato" required /></div>
          <div class="field"><label>Owner phone number</label><input name="owner_phone" value="+256 700 000 000" required /></div>
          <div class="field"><label>Owner email address</label><input name="owner_email" type="email" value="owner@zsacco.coop" required /></div>
          <div class="field"><label>Create password</label><div class="password-control"><input name="password" type="password" value="Zsacco2026!#" required /><button class="password-toggle" type="button" data-toggle-password aria-label="Show password" aria-pressed="false">${icons.eye}</button></div></div>
          <div class="field"><label>Confirm password</label><div class="password-control"><input name="confirm_password" type="password" value="Zsacco2026!#" required /><button class="password-toggle" type="button" data-toggle-password aria-label="Show password" aria-pressed="false">${icons.eye}</button></div></div>
          <div class="security-note full"><strong>Main account security</strong><span>This creates the SACCO owner/admin account. Members will later set their own limited-access member portal passwords.</span></div>
          <div class="security-note full"><strong>Password rules</strong><span>Use at least 12 characters with uppercase, lowercase, number, symbol, and no spaces.</span></div>
          <button class="gold-submit full" type="button" data-create-access>${icons.lock} Create account</button>
          <button class="glass-link" type="button" data-auth-tab="signin">Already have an account?</button>
        </div>
      </form>
    </div>
  </section>`;
}

function membersScreen() {
  return `<div class="screen">
    <div class="table-card">
      <div class="table-head"><h2 class="section-title">Member Management</h2>${toolbar("Search members by name, ID, or branch", ["All branches", "All statuses"])}</div>
      ${renderTable(["Member ID", "Name", "Branch", "Savings", "Loans", "Status"], members, "Edit")}
    </div>
  </div>`;
}

function memberForm() {
  const member = editingMember;
  uploadedKycDocuments = member?.documents ? [...member.documents] : [];
  const nameParts = String(member?.name || "").trim().split(/\s+/);
  const firstName = nameParts.shift() || "";
  const lastName = nameParts.join(" ");
  const phone = String(member?.phone || "");
  const phoneCode = ["+256", "+254", "+255", "+250", "+211", "+243"].find((code) => phone.startsWith(code)) || "+256";
  const localPhone = phone.startsWith(phoneCode) ? phone.slice(phoneCode.length) : phone;
  const esc = (value) => String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<div class="screen"><article class="card">
    <div class="card-title"><h2>${member ? `Edit ${esc(member.name)}` : "Add Member"}</h2><span class="pill">KYC required</span></div>
    <form class="form-grid">
      <input type="hidden" name="member_id" value="${esc(member?.id)}" />
      <div class="field"><label>First name</label><input name="first_name" value="${esc(firstName)}" placeholder="Enter first name" required /></div>
      <div class="field"><label>Last name</label><input name="last_name" value="${esc(lastName)}" placeholder="Enter last name" required /></div>
      <div class="field"><label>National ID</label><input name="national_id" value="${esc(member?.nationalId)}" placeholder="Enter national ID / NIN" ${member ? "" : "required"} /></div>
      <div class="field"><label>Phone number</label><div class="phone-input-group"><select name="country_code" required>${[["+256","UG +256"],["+254","KE +254"],["+255","TZ +255"],["+250","RW +250"],["+211","SS +211"],["+243","DRC +243"]].map(([value,label]) => `<option value="${value}" ${value === phoneCode ? "selected" : ""}>${label}</option>`).join("")}</select><input name="phone_local" value="${esc(localPhone)}" placeholder="700 000 000" required /></div></div>
      <div class="field"><label>Email address</label><input name="email" type="email" value="${esc(member?.email)}" placeholder="member@example.com" required /></div>
      <div class="field"><label>Branch</label><select name="branch" required>${[liveSacco?.location || "Main Branch", "Wandegeya", "Mukono"].map((branch) => `<option ${branch === member?.branch ? "selected" : ""}>${branch}</option>`).join("")}</select></div>
      <div class="field"><label>Membership type</label><select name="member_type" required>${["Individual", "Group", "Corporate"].map((type) => `<option ${type === (member?.memberType || "Individual") ? "selected" : ""}>${type}</option>`).join("")}</select></div>
      <div class="field"><label>Member portal password${member ? " (leave blank to keep current)" : ""}</label><div class="password-input-group"><div class="password-control"><input name="password" type="password" placeholder="${member ? "Keep current password" : "Create secure password"}" ${member ? "" : "required"} /><button class="password-toggle" type="button" data-toggle-password aria-label="Show password" aria-pressed="false">${icons.eye}</button></div><button class="ghost-button" type="button" data-generate-member-password>Generate</button></div></div>
      <div class="field full"><label>Address</label><textarea name="address" placeholder="Enter member address" ${member ? "" : "required"}>${esc(member?.address)}</textarea></div>
      <div class="security-note full"><strong>Password rules</strong><span>Use at least 12 characters with uppercase, lowercase, number, symbol, and no spaces.</span></div>
      <div class="kyc-upload-panel full">
        <div>
          <strong>KYC documents</strong>
          <p class="muted">Upload a profile photo, national ID, application form, or proof of residence for this member.</p>
        </div>
        <div class="kyc-upload-controls">
          <select name="kyc_document_type" data-kyc-type>
            <option>Profile photo</option>
            <option>National ID</option>
            <option>Proof of residence</option>
            <option>Application form</option>
            <option>Signature card</option>
            <option>Other KYC document</option>
          </select>
          <button class="ghost-button" type="button" data-upload-kyc>Upload KYC</button>
          <input class="hidden-file" type="file" accept="image/*,.pdf" multiple data-kyc-file-input />
        </div>
        <div class="kyc-preview-list" data-kyc-preview><span class="muted">No KYC files uploaded yet.</span></div>
      </div>
      <div class="form-actions full">${member ? '<button class="ghost-button" type="button" data-screen="members">Cancel</button>' : ""}<button class="primary-button" type="button" data-save-member>${member ? "Save changes" : "Add member"}</button></div>
    </form>
  </article></div>`;
}

function memberProfileAdmin() {
  const member = selectedMember || (selectedTransaction?.record?.memberId
    ? memberRecords.find((item) => item.id === selectedTransaction.record.memberId)
    : memberRecords[0]);
  const name = member?.name || "Amina Kato";
  const memberNumber = member?.memberNumber || "ZS-1001";
  const savings = member?.savingsBalance || accountRecords.filter((account) => account.memberName === name).reduce((sum, account) => sum + Number(account.balance || 0), 0) || 18240000;
  const memberTx = transactions.filter((row) => row[1] === name);
  const memberLoans = loanRows.filter((row) => row[1] === name);
  const memberAccountsCount = accountRecords.filter((account) => account.memberName === name).length;
  const documents = member?.documents || [];
  return `<div class="profile-layout">
    <aside class="card profile-panel">
      <div class="profile-hero">${avatarMarkup(name, member?.profilePhoto)}<div><h2>${name}</h2><p class="muted">${memberNumber} - ${liveSacco?.location || "Main Branch"}</p></div></div>
      <div class="grid" style="margin-top:22px">
        <div><p class="muted">Savings balance</p><h2>${formatUGX(savings)}</h2></div>
        <div><p class="muted">Outstanding loans</p><h2>${memberLoans.length}</h2></div>
        <div><p class="muted">Risk grade</p><span class="pill success">A Stable</span></div>
      </div>
      <div class="kyc-profile-list">
        <h3>KYC Files</h3>
        ${documents.length ? documents.map((doc) => `<div class="kyc-profile-item"><span>${icons.file}</span><div><strong>${doc.documentType}</strong><small>${doc.fileName}</small></div></div>`).join("") : '<p class="muted">No KYC documents uploaded yet.</p>'}
      </div>
    </aside>
    <section class="screen">
      <div class="grid three-col">
        ${moneyStat("Accounts", String(memberAccountsCount), "Active accounts", icons.wallet)}
        ${moneyStat("Transactions", String(memberTx.length), "Live history", icons.receipt)}
        ${moneyStat("Loans", String(memberLoans.length), "Current portfolio", icons.loan)}
      </div>
      <article class="table-card"><div class="table-head"><h2 class="section-title">Member Transactions</h2></div>${renderTable(["Ref", "Member", "Type", "Amount", "Date", "Status"], memberTx.slice(0, 4), "Open")}</article>
    </section>
  </div>`;
}

function accountsScreen(mode) {
  if (mode === "deposit" || mode === "withdrawal") {
    const deposit = mode === "deposit";
    const selectedAccount = accountRecords[0] || {};
    const accountOptions = accountRecords.map((account) => `<option value="${account.id}">${account.memberName} - ${account.accountNumber}</option>`).join("");
    return `<div class="grid two-col">
      <article class="card">
        <div class="card-title"><h2>${deposit ? "Deposit Interface" : "Withdrawal Interface"}</h2><span class="pill ${deposit ? "success" : "warn"}">${deposit ? "Cash in" : "Cash out"}</span></div>
        <form class="form-grid">
          <div class="field full"><label>Member account</label><select name="account_id">${accountOptions || '<option value="">No accounts available</option>'}</select></div>
          <div class="field"><label>Amount</label><input name="amount" value="2,000,000" /></div>
          <div class="field"><label>Payment method</label><select name="method"><option>Cash</option><option>Mobile Money</option><option>Bank transfer</option></select></div>
          <div class="field full"><label>Narration</label><textarea name="narration">${deposit ? "Monthly member savings deposit" : "Member withdrawal request approved at teller desk"}</textarea></div>
          <div class="form-actions full"><button class="primary-button" type="button" data-post-transaction="${deposit ? "Deposit" : "Withdrawal"}">${deposit ? "Post deposit" : "Process withdrawal"}</button><button class="ghost-button" type="button" data-print-receipt>Print receipt</button></div>
        </form>
      </article>
      <article class="card">
        <div class="card-title"><h2>Account Balance</h2><span class="pill success">Verified</span></div>
        <p class="muted">Available balance</p><p class="amount-xl" style="color:var(--ink)">${formatUGX(selectedAccount.balance || 0)}</p>
        <div class="summary-band"><div><p class="muted">Account</p><strong>${selectedAccount.accountNumber || "N/A"}</strong></div><div><p class="muted">Type</p><strong>${selectedAccount.accountType || "Savings"}</strong></div><div><p class="muted">Lien</p><strong>UGX 0</strong></div></div>
      </article>
    </div>`;
  }
  const accountRows = accountRecords.map((account) => rowWithRecord([
    account.accountNumber,
    account.memberName,
    account.accountType,
    formatUGX(account.balance || 0),
    formatDate(account.lastActivity),
    account.status || "Active",
  ], account));
  return `<div class="screen"><article class="table-card"><div class="table-head"><h2 class="section-title">Savings Accounts</h2>${toolbar("Search accounts", ["Account type", "Branch"])}</div>${renderTable(["Account", "Member", "Type", "Balance", "Last Activity", "Status"], accountRows)}</article></div>`;
}

function loansScreen(kind) {
  if (kind === "application") {
    const memberOptions = memberRecords.map((member) => `<option value="${member.id}">${member.name} - ${member.memberNumber}</option>`).join("");
    return `<div class="screen"><article class="card"><div class="card-title"><h2>Loan Application Form</h2><span class="pill">Credit scoring</span></div>
      <form class="form-grid">
        <div class="field"><label>Member</label><select name="member_id">${memberOptions || '<option value="">No members available</option>'}</select></div>
        <div class="field"><label>Loan product</label><select name="product"><option>Business Expansion</option><option>Agriculture</option><option>Education</option><option>Emergency</option></select></div>
        <div class="field"><label>Requested amount</label><input name="amount" value="12,000,000" /></div>
        <div class="field"><label>Term</label><select name="term"><option>18 months</option><option>24 months</option><option>12 months</option></select></div>
        <div class="field full"><label>Purpose</label><textarea name="purpose">Purchase inventory and expand retail outlet.</textarea></div>
        <div class="form-actions full"><button class="primary-button" type="button" data-submit-loan>Submit application</button><button class="ghost-button" type="button" data-attach-documents>Attach documents</button></div>
      </form></article></div>`;
  }
  if (kind === "approval") {
    return `<div class="screen"><div class="grid three-col">${moneyStat("Pending Review", loanRows.filter((loan) => loan[5] === "Watch").length, "Needs decision", icons.file)}${moneyStat("Approved", String(loanRows.filter((loan) => loan[5] === "Performing").length), "Live approvals", icons.shield)}${moneyStat("Rejected", String(loanRows.filter((loan) => loan[5] === "Rejected").length), "Policy checks", icons.loan)}</div><article class="table-card"><div class="table-head"><h2 class="section-title">Loan Approval Queue</h2>${toolbar("Search applications", ["Risk grade", "Loan product"])}</div>${renderTable(["Loan ID","Member","Purpose","Amount","Progress","Status"], loanRows, "Decide")}</article></div>`;
  }
  if (kind === "details") {
    const record = selectedLoan?.record || loanRecords[0] || {};
    const nextDue = record.nextDue ? formatDate(record.nextDue) : "Not scheduled";
    const installment = record.termMonths ? formatUGX((Number(record.requestedAmount || 0) / record.termMonths) || 0) : "UGX 0";
    return `<div class="grid two-col"><article class="card"><div class="card-title"><h2>Loan Details</h2><span class="pill ${selectedLoan[5] === "Rejected" ? "warn" : "success"}">${selectedLoan[5]}</span></div><div class="summary-band"><div><p class="muted">Principal</p><strong>${selectedLoan[3]}</strong></div><div><p class="muted">Outstanding</p><strong>${formatUGX(Number(record.requestedAmount || 0) * (1 - (Number(record.progressPercent || 0) / 100)))}</strong></div><div><p class="muted">Rate</p><strong>${record.annualRate || 14}%</strong></div></div><h3>Repayment Progress</h3><div class="progress"><span style="width:${selectedLoan[4]}"></span></div><p class="muted">${selectedLoan[4]} repaid - next installment due ${nextDue}</p><div class="form-actions"><button class="primary-button" type="button" data-loan-decision="approve">Approve</button><button class="danger-button" type="button" data-loan-decision="reject">Reject</button></div></article><article class="card"><div class="card-title"><h2>Repayment Schedule</h2></div><div class="loan-schedule">${[0,1,2,3].map((_, i) => `<div class="schedule-item"><span class="status-dot ${i ? "blue" : "warn"}"></span><div><strong>${installment}</strong><br><small>${i ? formatDate(new Date(Date.now() + (i + 1) * 30 * 86400000)) : nextDue}</small></div><span class="pill ${i ? "dark" : "warn"}">${i ? "Upcoming" : "Due"}</span></div>`).join("")}</div></article></div>`;
  }
  return `<div class="screen"><article class="table-card"><div class="table-head"><h2 class="section-title">Loan Management</h2>${toolbar("Search loans", ["Loan status", "Product"])}</div>${renderTable(["Loan ID","Member","Purpose","Amount","Progress","Status"], loanRows, "Open")}</article></div>`;
}

function transactionsScreen() {
  return `<div class="screen"><article class="table-card"><div class="table-head"><h2 class="section-title">Full Transaction History</h2>${toolbar("Search transactions", ["Date range", "Transaction type", "Member"])}</div>${renderTable(["Ref", "Member", "Type", "Amount", "Date", "Status"], transactions, "Details")}</article><article class="card"><div class="card-title"><h2>Transaction Details</h2><span class="pill success">Audit logged</span></div><div class="form-grid"><div><p class="muted">Reference</p><strong>${selectedTransaction[0]}</strong></div><div><p class="muted">Member</p><strong>${selectedTransaction[1]}</strong></div><div><p class="muted">Type</p><strong>${selectedTransaction[2]}</strong></div><div><p class="muted">Amount</p><strong>${selectedTransaction[3]}</strong></div><div><p class="muted">Posted by</p><strong>Ruth Akello</strong></div><div><p class="muted">Channel</p><strong>Teller counter</strong></div></div></article></div>`;
}

function reportsScreen() {
  const totalSavings = accountRecords.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  const loanPortfolio = loanRecords.reduce((sum, loan) => sum + Number(loan.approvedAmount || loan.requestedAmount || 0), 0);
  const statements = members.slice(0, 5).map((member, index) => [`ST-${7091 - index}`, member[1], "Current month", member[3], todayLabel(), "Completed"]);
  return `<div class="screen"><section class="grid stats-grid">${moneyStat("Net Savings", formatUGX(totalSavings, true), "Live accounts", icons.wallet)}${moneyStat("Loan Portfolio", formatUGX(loanPortfolio, true), "Approved + pending", icons.loan)}${moneyStat("Arrears Rate", "0.0%", "No arrears recorded", icons.report)}${moneyStat("Exported Reports", String(statements.length), "Ready now", icons.file)}</section><section class="grid two-col"><article class="card"><div class="card-title"><h2>Financial Summary</h2><button class="primary-button" data-download="financial-summary">${icons.file} Download PDF</button></div><div class="chart">${["Savings","Loans","Members","Accounts","Transactions"].map((m, i) => `<div class="bar"><span style="height:${90 + i * 24}px"></span>${m}</div>`).join("")}</div></article><article class="table-card"><div class="table-head"><h2 class="section-title">Member Statements</h2><button class="ghost-button" data-download="statements">${icons.file} Export CSV</button></div>${renderTable(["Statement","Member","Period","Balance","Generated","Status"], statements, "Download")}</article></section></div>`;
}

function usersScreen() {
  return `<div class="screen"><article class="table-card"><div class="table-head"><h2 class="section-title">Staff Accounts & Roles</h2><button class="primary-button">${icons.user} Add staff</button></div>${renderTable(["Staff","Role","Branch","Access","Status"], staffRows, "Edit")}</article><article class="card"><div class="card-title"><h2>Role Permissions</h2></div><div class="grid three-col"><div class="activity-item"><span class="stat-icon">${icons.shield}</span><div><strong>Admin</strong><br><small>System settings, users, approvals, reports</small></div></div><div class="activity-item"><span class="stat-icon">${icons.report}</span><div><strong>Manager</strong><br><small>Member oversight, loan decisions, reports</small></div></div><div class="activity-item"><span class="stat-icon">${icons.receipt}</span><div><strong>Teller</strong><br><small>Deposits, withdrawals, receipts</small></div></div></div></article></div>`;
}

const adminScreens = {
  dashboard,
  members: membersScreen,
  memberForm,
  memberProfile: memberProfileAdmin,
  accounts: () => accountsScreen("accounts"),
  deposit: () => accountsScreen("deposit"),
  withdrawal: () => accountsScreen("withdrawal"),
  loans: () => loansScreen("list"),
  loanApplication: () => loansScreen("application"),
  loanApproval: () => loansScreen("approval"),
  loanDetails: () => loansScreen("details"),
  transactions: transactionsScreen,
  reports: reportsScreen,
  users: usersScreen,
  adminLogin: () => authScreen("admin"),
};

function memberPortalRecords() {
  const userId = String(currentSessionUser?.id || "");
  const memberNumber = String(currentSessionUser?.memberNumber || currentSessionUser?.memberId || "");
  const member = memberRecords.find((item) => (userId && String(item.id) === userId) || (memberNumber && String(item.memberNumber) === memberNumber)) || null;
  if (!member) return { member: {}, accounts: [], transactions: [], loans: [] };
  const accounts = accountRecords.filter((item) => String(item.memberId) === String(member.id));
  const accountIds = new Set(accounts.map((item) => String(item.id)));
  const transactions = transactionRecords.filter((item) => String(item.memberId) === String(member.id) || accountIds.has(String(item.accountId)));
  const loans = loanRecords.filter((item) => String(item.memberId) === String(member.id));
  return { member, accounts, transactions, loans };
}

function memberTransactionRows(records) {
  return records.map((item) => rowWithRecord([
    item.reference,
    item.transactionType,
    formatUGX(item.amount || 0),
    formatDate(item.date),
    item.status || "Completed",
  ], item));
}

function memberDashboard() {
  const { member, accounts, transactions: memberTransactions, loans } = memberPortalRecords();
  const transactionRows = memberTransactionRows(memberTransactions);
  const savings = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  const loan = loans.find((item) => String(item.status || "").toLowerCase() !== "rejected") || {};
  const outstanding = Number(loan.requestedAmount || 0) * (1 - (Number(loan.progressPercent || 0) / 100));
  return `<div class="screen">
    <section class="grid stats-grid">
      ${moneyStat("My Savings", formatUGX(savings, true), "Across my accounts", icons.wallet)}
      ${moneyStat("My Accounts", accounts.length.toLocaleString(), "Active member accounts", icons.wallet)}
      ${moneyStat("My Active Loans", loans.filter((item) => !["rejected", "closed"].includes(String(item.status || "").toLowerCase())).length.toLocaleString(), "Personal loan portfolio", icons.loan)}
      ${moneyStat("My Transactions", memberTransactions.length.toLocaleString(), "Personal activity", icons.receipt)}
    </section>
    <section class="portal-hero">
      <article class="portal-card balance-card">
        <p class="eyebrow">Available savings</p><div class="amount-xl">${formatUGX(savings)}</div>
        <div class="quick-grid"><div class="quick-card"><p class="muted">Accounts</p><strong>${accounts.length}</strong></div><div class="quick-card"><p class="muted">Loan balance</p><strong>${formatUGX(outstanding)}</strong></div><div class="quick-card"><p class="muted">Next payment</p><strong>${loan.nextDue ? formatDate(loan.nextDue) : "N/A"}</strong></div></div>
      </article>
      <article class="portal-card"><div class="card-title"><h2>My Activity</h2><span class="pill success">Private</span></div><div class="activity">${transactionRows.slice(0, 2).map((row) => `<div class="activity-item"><span class="status-dot"></span><div><strong>${row[1]}</strong><br><small>${row[2]} - ${row[3]}</small></div></div>`).join("") || '<div class="empty-state">No activity yet.</div>'}<div class="activity-item"><span class="status-dot warn"></span><div><strong>Next repayment</strong><br><small>${loan.nextDue ? formatDate(loan.nextDue) : "No repayment scheduled"}</small></div></div></div></article>
    </section>
    <section class="grid two-col"><article class="table-card"><div class="table-head"><h2 class="section-title">My Recent Transactions</h2></div>${renderTable(["Ref", "Type", "Amount", "Date", "Status"], transactionRows.slice(0, 3), "View")}</article><article class="portal-card"><div class="card-title"><h2>My Loan Balance</h2></div><div class="progress"><span style="width:${loan.progressPercent || 0}%"></span></div><p class="muted">${formatUGX(outstanding)} remaining on ${loan.product || "current"} loan.</p></article></section>
  </div>`;
}

function memberSavings() {
  const { accounts, transactions: memberTransactions } = memberPortalRecords();
  const savings = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  return `<div class="screen"><article class="portal-card balance-card"><p class="eyebrow">My savings balance</p><div class="amount-xl">${formatUGX(savings)}</div><div class="split-actions"><button class="ghost-button" data-download="member-statement">Download statement</button><button class="ghost-button" data-support>Request support</button></div></article><article class="table-card"><div class="table-head"><h2 class="section-title">My Transaction History</h2>${toolbar("Search my savings history", ["Date", "Type"])}</div>${renderTable(["Ref", "Type", "Amount", "Date", "Status"], memberTransactionRows(memberTransactions), "Details")}</article></div>`;
}

function memberLoans() {
  const { loans } = memberPortalRecords();
  const loan = loans[0] || {};
  const progress = Number(loan.progressPercent || 0);
  const outstanding = Number(loan.requestedAmount || 0) * (1 - progress / 100);
  const installment = loan.termMonths ? formatUGX(Number(loan.requestedAmount || 0) / loan.termMonths) : "UGX 0";
  return `<div class="screen"><section class="grid three-col">${moneyStat("Loan Status", loan.status || "No loan", "Live status", icons.shield)}${moneyStat("Outstanding", formatUGX(outstanding), `${progress}% repaid`, icons.loan)}${moneyStat("Next Due", loan.nextDue ? formatDate(loan.nextDue) : "N/A", installment, icons.receipt)}</section><article class="portal-card"><div class="card-title"><h2>Repayment Progress</h2><span class="pill success">On time</span></div><div class="progress"><span style="width:${progress}%"></span></div><p class="muted">${progress}% completed on ${loan.product || "current"} loan.</p></article><article class="portal-card"><div class="card-title"><h2>Schedule</h2></div><div class="loan-schedule">${[0,1,2].map((_, i) => `<div class="schedule-item"><span class="status-dot ${i ? "blue" : "warn"}"></span><div><strong>${installment}</strong><br><small>${i ? formatDate(new Date(Date.now() + (i + 1) * 30 * 86400000)) : (loan.nextDue ? formatDate(loan.nextDue) : "N/A")}</small></div><span class="pill ${i ? "dark" : "warn"}">${i ? "Upcoming" : "Due"}</span></div>`).join("")}</div></article></div>`;
}

function memberProfilePortal() {
  const { member } = memberPortalRecords();
  const documents = member.documents || [];
  return `<div class="grid two-col"><article class="portal-card"><div class="profile-hero">${avatarMarkup(member.name, member.profilePhoto)}<div><h2>${member.name || "Member"}</h2><p class="muted">Member ${member.memberNumber || "N/A"} - ${liveSacco?.name || "Z-SACCO"}</p></div></div><div class="form-grid" style="margin-top:18px"><div><p class="muted">Phone</p><strong>${member.phone || "Not provided"}</strong></div><div><p class="muted">Email</p><strong>${member.email || "Not provided"}</strong></div><div><p class="muted">Branch</p><strong>${liveSacco?.location || "Main Branch"}</strong></div><div><p class="muted">Registration</p><strong>${liveSacco?.registrationNumber || lastSaccoRegistration}</strong></div></div></article><article class="portal-card"><div class="card-title"><h2>KYC & Security</h2><span class="pill success">Verified</span></div><div class="activity"><div class="activity-item"><span class="status-dot"></span><div><strong>Member account active</strong><br><small>Live SACCO record</small></div></div><div class="activity-item"><span class="status-dot"></span><div><strong>KYC files</strong><br><small>${documents.length} document${documents.length === 1 ? "" : "s"} on file</small></div></div></div></article></div>`;
}

const memberScreens = {
  memberDashboard,
  memberSavings,
  memberLoans,
  memberProfile: memberProfilePortal,
  memberLogin: () => authScreen("member"),
};

function nav(container, items, active, target) {
  container.innerHTML = items.map(([id, label, icon]) => {
    const action = id === "logout" ? "data-logout" : `data-${target}="${id}"`;
    return `<button class="nav-item ${id === active ? "active" : ""}" ${action}>${icon}<span>${label}</span></button>`;
  }).join("");
}

function setAdminScreen(id) {
  currentAdminScreen = id;
  const item = id === "adminLogin"
    ? ["adminLogin", "Staff Login", icons.lock]
    : adminNavItems.find(([key]) => key === id) || adminNavItems[0];
  nav(document.querySelector("#adminNav"), adminNavItems, item[0], "screen");
  pageTitle.textContent = item[0] === "memberForm" && editingMember ? "Edit Member" : item[1];
  sectionLabel.textContent = item[0] === "adminLogin" ? "Authentication" : "Back Office";
  appFrame.classList.toggle("login-mode", item[0] === "adminLogin");
  adminContent.innerHTML = adminScreens[item[0]]();
  appFrame.classList.remove("menu-open");
}

function setMemberScreen(id) {
  currentMemberScreen = id;
  const item = id === "memberLogin"
    ? ["memberLogin", "Member Login", icons.lock]
    : memberNavItems.find(([key]) => key === id) || memberNavItems[0];
  nav(document.querySelector("#memberNav"), memberNavItems, item[0], "member-screen");
  portalFrame.classList.toggle("login-mode", item[0] === "memberLogin");
  memberContent.innerHTML = memberScreens[item[0]]();
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function todayLabel() {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date());
}

function formatDate(value) {
  if (!value) return todayLabel();
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function amountValue(value) {
  return Number(String(value || "0").replace(/[^0-9.-]/g, "")) || 0;
}

function formatUGX(value, compact = false) {
  const amount = Number(value) || 0;
  if (compact && amount >= 1_000_000_000) return `UGX ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (compact && amount >= 1_000_000) return `UGX ${(amount / 1_000_000).toFixed(1)}M`;
  return `UGX ${Math.round(amount).toLocaleString()}`;
}

function parseTermMonths(value) {
  return Number(String(value || "12").replace(/[^0-9]/g, "")) || 12;
}

function rowWithRecord(row, record) {
  row.record = record;
  return row;
}

function syncAppData(data) {
  if (!data) return;
  liveSacco = data.sacco || liveSacco;
  appSummary = data.summary || appSummary;
  memberRecords = data.members || [];
  accountRecords = data.accounts || accountRecords;
  transactionRecords = data.transactions || [];
  loanRecords = data.loans || [];
  staffRecords = data.staff || [];

  members = memberRecords.map((member) => rowWithRecord([
    member.memberNumber,
    member.name,
    member.branch || liveSacco?.location || "Main Branch",
    formatUGX(member.savingsBalance || 0),
    String(member.loansCount || 0),
    member.status || "Active",
  ], member));

  transactions = transactionRecords.map((transaction) => rowWithRecord([
    transaction.reference,
    transaction.memberName,
    transaction.transactionType,
    formatUGX(transaction.amount || 0),
    formatDate(transaction.date),
    transaction.status || "Completed",
  ], transaction));

  loanRows = loanRecords.map((loan) => rowWithRecord([
    loan.loanNumber,
    loan.memberName,
    loan.product,
    formatUGX(loan.requestedAmount || loan.approvedAmount || 0),
    `${loan.progressPercent || 0}%`,
    loan.status || "Watch",
  ], loan));

  staffRows = staffRecords.map((staff) => rowWithRecord([
    staff.name,
    staff.role || "Admin",
    staff.branch || liveSacco?.location || "Head Office",
    staff.access || "Full access",
    staff.status || "Active",
  ], staff));

  selectedTransaction = transactions[0] || selectedTransaction;
  selectedLoan = loanRows[0] || selectedLoan;
}

async function refreshAppData() {
  if (!authToken) return null;
  const data = await apiRequest("/api/app-data", { token: authToken });
  syncAppData(data);
  return data;
}

function nextRef(prefix) {
  return `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`;
}

function nextSaccoRegistration() {
  const year = new Date().getFullYear();
  return `ZS-SACCO-${year}-${Math.floor(100000 + Math.random() * 899999)}`;
}

function generateSecurePassword(length = 16) {
  const groups = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%&*?"];
  const all = groups.join("");
  const chars = groups.map((group) => group[Math.floor(Math.random() * group.length)]);
  while (chars.length < length) chars.push(all[Math.floor(Math.random() * all.length)]);
  return chars.sort(() => Math.random() - 0.5).join("");
}

function renderKycPreview(form) {
  const preview = form.querySelector("[data-kyc-preview]");
  if (!preview) return;
  if (!uploadedKycDocuments.length) {
    preview.innerHTML = '<span class="muted">No KYC files uploaded yet.</span>';
    return;
  }
  preview.innerHTML = uploadedKycDocuments.map((doc, index) => `<div class="kyc-preview-item">
    ${doc.mimeType.startsWith("image/") ? `<img src="${doc.dataUrl}" alt="${doc.documentType}" />` : `<span class="kyc-file-icon">${icons.file}</span>`}
    <div><strong>${doc.documentType}</strong><small>${doc.fileName}</small></div>
    <button class="ghost-button" type="button" data-remove-kyc="${index}">Remove</button>
  </div>`).join("");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

async function addKycFiles(input) {
  const form = input.closest("form");
  const documentType = form.querySelector("[data-kyc-type]")?.value || "KYC Document";
  const files = [...input.files];
  if (!files.length) return;
  for (const file of files) {
    if (file.size > 2_000_000) {
      showToast(`${file.name} is too large. Use files below 2MB for now.`);
      continue;
    }
    const dataUrl = await readFileAsDataUrl(file);
    if (documentType === "Profile photo") {
      uploadedKycDocuments = uploadedKycDocuments.filter((doc) => !doc.isProfilePhoto);
    }
    uploadedKycDocuments.push({
      documentType,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      dataUrl,
      isProfilePhoto: documentType === "Profile photo",
    });
  }
  input.value = "";
  renderKycPreview(form);
  showToast(`${files.length} KYC file${files.length === 1 ? "" : "s"} added.`);
}

function downloadFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function apiRequest(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error(response.ok
      ? "The server returned an invalid response."
      : `The server endpoint is unavailable (${response.status}). Please try again after deployment.`);
  }
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function tableRowValues(button) {
  return [...button.closest("tr").children].slice(0, -1).map((cell) => cell.innerText.trim());
}

function filterTable(input) {
  const tableCard = input.closest(".table-card");
  const table = tableCard?.querySelector("table");
  if (!table) return;
  const query = input.value.trim().toLowerCase();
  let visible = 0;
  table.querySelectorAll("tbody tr").forEach((row) => {
    const match = row.innerText.toLowerCase().includes(query);
    row.hidden = !match;
    if (match) visible += 1;
  });
  tableCard.querySelector(".empty-state")?.remove();
  if (!visible) table.insertAdjacentHTML("afterend", '<div class="empty-state">No matching records found.</div>');
}

async function postTransaction(type, button) {
  const form = button.closest("form");
  const accountSelect = form.querySelector('[name="account_id"]');
  const account = accountRecords.find((item) => String(item.id) === String(accountSelect.value));
  const amount = form.querySelector('[name="amount"]').value.trim() || "0";
  const member = account?.memberName || accountSelect.selectedOptions[0]?.textContent.split(" - ")[0] || "Member";
  if (authToken && account?.id && !String(account.id).startsWith("demo-")) {
    try {
      const data = await apiRequest("/api/transactions", {
        token: authToken,
        accountId: account.id,
        transactionType: type,
        amount,
        method: form.querySelector('[name="method"]').value,
        narration: form.querySelector('[name="narration"]').value,
      });
      syncAppData(data);
      showToast(`${type} posted for ${member}. Dashboard data is updated.`);
      setAdminScreen("transactions");
      return;
    } catch (error) {
      showToast(error.message || `${type} could not be posted.`);
      return;
    }
  }
  const row = [nextRef("TX"), member, type, `UGX ${amount}`, todayLabel(), type === "Deposit" ? "Completed" : "Approved"];
  transactions.unshift(row);
  selectedTransaction = row;
  showToast(`${type} posted for ${member}. Transaction ${row[0]} is now in history.`);
  setAdminScreen("transactions");
}

async function saveMember(button) {
  const form = button.closest("form");
  form.classList.add("was-validated");
  if (!form.checkValidity()) {
    showToast("Please fill in all member details before saving.");
    return;
  }
  const data = new FormData(form);
  const first = String(data.get("first_name") || "").trim();
  const last = String(data.get("last_name") || "").trim();
  const branch = String(data.get("branch") || liveSacco?.location || "Main Branch");
  const password = String(data.get("password") || "");
  const memberId = String(data.get("member_id") || "");
  const localPhone = String(data.get("phone_local") || "").replace(/^0+/, "").replace(/\D/g, "");
  const phone = `${data.get("country_code")}${localPhone}`;
  if (localPhone.length < 6) {
    showToast("Please enter a valid member phone number.");
    return;
  }
  if ((!memberId || password) && !validatePassword(password)) {
    showToast("Member password is too weak. Use 12+ characters with uppercase, lowercase, number, symbol, and no spaces.");
    return;
  }
  if (authToken) {
    try {
      const result = await apiRequest("/api/members", {
        token: authToken,
        memberId,
        name: `${first} ${last}`,
        phone,
        email: data.get("email"),
        branch,
        nationalId: data.get("national_id"),
        memberType: data.get("member_type"),
        address: data.get("address"),
        password,
        temporaryPassword: password,
        kycDocuments: uploadedKycDocuments,
      });
      syncAppData(result);
      editingMember = null;
      showToast(memberId ? `${first} ${last} updated successfully.` : `${first} ${last} added. Login details were queued for email and phone.`);
      setAdminScreen("members");
      return;
    } catch (error) {
      showToast(error.message || "Member could not be saved.");
      return;
    }
  }
  const existing = members.find((member) => member[1] === `${first} ${last}`);
  if (existing) {
    existing[2] = branch;
    existing[5] = "Active";
    showToast(`${first} ${last} updated successfully.`);
  } else {
    const memberNumber = `ZS-${1000 + members.length + 1}`;
    const profilePhoto = uploadedKycDocuments.find((doc) => doc.isProfilePhoto)?.dataUrl || "";
    memberRecords.unshift({
      memberNumber,
      name: `${first} ${last}`,
      phone,
      email: data.get("email"),
      branch,
      profilePhoto,
      documents: uploadedKycDocuments,
      savingsBalance: 0,
      loansCount: 0,
      status: "Active",
    });
    members.unshift([memberNumber, `${first} ${last}`, branch, "UGX 0", "0", "Active"]);
    showToast(`${first} ${last} added as a Z-SACCO member.`);
  }
  setAdminScreen("members");
}

async function submitLoan(button) {
  const form = button.closest("form");
  const data = new FormData(form);
  const memberRecord = memberRecords.find((member) => String(member.id) === String(data.get("member_id")));
  const member = memberRecord?.name || form.querySelector('[name="member_id"]').selectedOptions[0]?.textContent.split(" - ")[0] || "Member";
  const product = data.get("product");
  const amount = `UGX ${data.get("amount") || "0"}`;
  if (authToken && memberRecord?.id) {
    try {
      const result = await apiRequest("/api/loans", {
        token: authToken,
        memberId: memberRecord.id,
        product,
        amount: data.get("amount"),
        term: data.get("term"),
        purpose: data.get("purpose"),
      });
      syncAppData(result);
      showToast(`Loan application submitted for ${member}.`);
      setAdminScreen("loanApproval");
      return;
    } catch (error) {
      showToast(error.message || "Loan application could not be submitted.");
      return;
    }
  }
  const loan = [nextRef("LN"), member, product, amount, "0%", "Watch"];
  loanRows.unshift(loan);
  selectedLoan = loan;
  showToast(`Loan application ${loan[0]} submitted for review.`);
  setAdminScreen("loanApproval");
}

async function decideLoan(decision) {
  const loanId = selectedLoan?.record?.id;
  if (authToken && loanId) {
    try {
      const result = await apiRequest("/api/loans/decision", { token: authToken, loanId, decision });
      syncAppData(result);
      showToast(`Loan ${selectedLoan[0]} ${decision === "approve" ? "approved" : "rejected"}.`);
      setAdminScreen("loanApproval");
      return;
    } catch (error) {
      showToast(error.message || "Loan decision could not be saved.");
      return;
    }
  }
  selectedLoan[5] = decision === "approve" ? "Performing" : "Rejected";
  selectedLoan[4] = decision === "approve" ? "5%" : selectedLoan[4];
  showToast(`Loan ${selectedLoan[0]} ${decision === "approve" ? "approved" : "rejected"}.`);
  setAdminScreen("loanApproval");
}

function setAuthMode(mode, button) {
  const authCard = button.closest(".auth-art-card");
  if (!authCard) return;
  authCard.querySelectorAll("[data-auth-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.authPanel !== mode);
  });
}

function showAdminLogin(mode = "signin") {
  publicSite.classList.add("hidden");
  portalFrame.classList.add("hidden");
  appFrame.classList.remove("hidden");
  setAdminScreen("adminLogin");
  const panel = adminContent.querySelector(`[data-auth-panel="${mode}"]`);
  if (panel) {
    adminContent.querySelectorAll("[data-auth-panel]").forEach((item) => {
      item.classList.toggle("hidden", item.dataset.authPanel !== mode);
    });
  }
}

function showMemberLogin(mode = "signin") {
  publicSite.classList.add("hidden");
  appFrame.classList.add("hidden");
  portalFrame.classList.remove("hidden");
  setMemberScreen("memberLogin");
  const panel = memberContent.querySelector(`[data-auth-panel="${mode}"]`);
  if (panel) {
    memberContent.querySelectorAll("[data-auth-panel]").forEach((item) => {
      item.classList.toggle("hidden", item.dataset.authPanel !== mode);
    });
  }
}

function openSystemAuth(mode = "signin") {
  showAdminLogin(mode);
}

function chooseLoginRole(role) {
  if (currentSessionRole && currentSessionRole !== role) {
    showToast(`Please logout from the ${currentSessionRole} session before logging in as ${role}.`);
    return;
  }
  if (role === "member") showMemberLogin("signin");
  else showAdminLogin("signin");
}

async function loginAsRole(role, button) {
  if (currentSessionRole && currentSessionRole !== role) {
    showToast(`Please logout from the ${currentSessionRole} session before switching accounts.`);
    return;
  }
  const form = button.closest("form");
  const remember = form.querySelector('[name="remember_device"]')?.checked;
  if (role === "admin") {
    const email = form.querySelector('[name="admin_email"]')?.value.trim().toLowerCase();
    const password = form.querySelector('[name="admin_password"]')?.value;
    try {
      const result = await apiRequest("/api/auth/login", { role: "admin", email, password, rememberDevice: remember });
      currentSessionUser = result.user;
      authToken = result.token;
    } catch (error) {
      showToast(error.message || "Invalid admin login details.");
      return;
    }
    currentSessionRole = "admin";
    if (remember) localStorage.setItem("zsacco_remembered_admin", currentSessionUser.email);
    if (authToken) {
      try {
        await refreshAppData();
      } catch (error) {
        showToast(error.message || "Dashboard data could not be loaded.");
      }
    }
    setAdminScreen("dashboard");
    appFrame.classList.remove("hidden");
    portalFrame.classList.add("hidden");
    showToast(`Welcome back, ${currentSessionUser.name}. Device ${remember ? "remembered" : "not remembered"}.`);
    return;
  }
  const identity = form.querySelector('[name="member_identity"]')?.value.trim().toLowerCase();
  const password = form.querySelector('[name="member_password"]')?.value;
  try {
    const result = await apiRequest("/api/auth/login", { role: "member", identity, password, rememberDevice: remember });
    currentSessionUser = result.user;
    authToken = result.token;
  } catch (error) {
    showToast(error.message || "Invalid member login details.");
    return;
  }
  currentSessionRole = "member";
  if (remember) localStorage.setItem("zsacco_remembered_member", currentSessionUser.memberNumber);
  if (authToken) {
    try {
      await refreshAppData();
    } catch (error) {
      showToast(error.message || "Member data could not be loaded.");
    }
  }
  setMemberScreen("memberDashboard");
  portalFrame.classList.remove("hidden");
  appFrame.classList.add("hidden");
  showToast(`Welcome to the member portal, ${currentSessionUser.name}.`);
}

async function logout() {
  const role = currentSessionRole;
  if (authToken) {
    try {
      await apiRequest("/api/auth/logout", { token: authToken });
    } catch {
      // Local logout still clears the prototype session if the backend is unavailable.
    }
  }
  currentSessionRole = null;
  currentSessionUser = null;
  authToken = null;
  publicSite.classList.add("hidden");
  portalFrame.classList.add("hidden");
  appFrame.classList.remove("hidden");
  setAdminScreen("adminLogin");
  showToast(role ? `Logged out from ${role} session.` : "You are on the login page.");
}

async function forgotPassword(role, button) {
  const form = button.closest("form");
  const target = role === "member"
    ? form.querySelector('[name="member_identity"]')?.value || "member account"
    : form.querySelector('[name="admin_email"]')?.value || "admin account";
  try {
    const result = await apiRequest("/api/auth/forgot-password", { role, identity: target });
    downloadFile(`z-sacco-${role}-password-reset.txt`, result.email?.body || `Reset code: ${result.resetCode}`);
    showToast(`Password reset instructions prepared for ${target}.`);
    return;
  } catch {
    // Fall back to local reset copy when running the frontend without the backend server.
  }
  const resetCode = nextRef("RESET");
  const body = `Z-SACCO Password Reset\nAccount: ${target}\nRole: ${role}\nReset Code: ${resetCode}\n\nUse this code to reset your password. This is a prototype email copy.`;
  downloadFile(`z-sacco-${role}-password-reset.txt`, body);
  showToast(`Password reset instructions prepared for ${target}.`);
}

function guardedSwitch(destination) {
  if (destination === "member" && currentSessionRole === "admin") {
    showToast("Logout from the admin account before logging in as a member.");
    return;
  }
  if (destination === "admin" && currentSessionRole === "member") {
    showToast("Logout from the member account before logging in as admin.");
    return;
  }
  publicSite.classList.add("hidden");
  if (destination === "member") {
    if (currentSessionRole === "member") {
      appFrame.classList.add("hidden");
      portalFrame.classList.remove("hidden");
      setMemberScreen("memberDashboard");
    } else {
      showMemberLogin("signin");
    }
  }
  if (destination === "admin") {
    if (currentSessionRole === "admin") {
      portalFrame.classList.add("hidden");
      appFrame.classList.remove("hidden");
      setAdminScreen("dashboard");
    } else {
      showAdminLogin("signin");
    }
  }
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setFeatureDetail(card) {
  const key = card.dataset.feature;
  const detail = featureDetails[key];
  const detailBox = document.querySelector("#featureDetail");
  if (!detail || !detailBox) return;
  detailBox.querySelector("strong").textContent = detail[0];
  detailBox.querySelector("p").textContent = detail[1];
}

async function submitContactForm(button) {
  const form = button.closest(".contact-form");
  form.classList.add("was-validated");
  if (!form.checkValidity()) {
    showToast("Please complete the contact form before sending.");
    return;
  }
  const data = new FormData(form);
  const originalLabel = button.innerHTML;
  button.disabled = true;
  button.innerHTML = "Sending inquiry…";
  try {
    const result = await apiRequest("/api/inquiries", {
      saccoName: data.get("sacco"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
    });
    showToast(result.message || "Your inquiry has been received.");
    form.reset();
    form.classList.remove("was-validated");
  } catch (error) {
    showToast(error.message || "We could not send your inquiry. Please try again.");
  } finally {
    button.disabled = false;
    button.innerHTML = originalLabel;
  }
}

function validatePassword(password) {
  return password.length >= 12
    && !/\s/.test(password)
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

async function createSaccoAccount(button) {
  const form = button.closest("form");
  form.classList.add("was-validated");
  if (!form.checkValidity()) {
    showToast("Please complete all required SACCO and owner details.");
    return;
  }
  const data = new FormData(form);
  const password = String(data.get("password") || "");
  const confirmPassword = String(data.get("confirm_password") || "");
  if (!validatePassword(password)) {
    showToast("Password is too weak. Use 12+ characters with uppercase, lowercase, number, symbol, and no spaces.");
    return;
  }
  if (password !== confirmPassword) {
    showToast("Passwords do not match. Please confirm the password correctly.");
    return;
  }
  try {
    const result = await apiRequest("/api/saccos", {
      saccoName: data.get("sacco_name"),
      saccoPhone: data.get("sacco_phone"),
      saccoEmail: data.get("sacco_email"),
      location: data.get("location"),
      memberCount: data.get("members_count"),
      ownerName: data.get("owner_name"),
      ownerPhone: data.get("owner_phone"),
      ownerEmail: data.get("owner_email"),
      password,
      confirmPassword,
    });
    lastSaccoRegistration = result.sacco.registrationNumber;
    adminAccounts.unshift({
      name: result.admin.name,
      email: result.admin.email,
      password,
      memberName: result.admin.name,
      memberPassword: password,
    });
    memberAccounts.unshift({
      name: result.member.name,
      memberId: result.member.memberNumber,
      saccoRegistration: result.sacco.registrationNumber,
      password,
    });
    showToast(result.message);
    form.querySelector(".generated-id")?.remove();
    form.dataset.emailBody = result.email.body;
    form.insertAdjacentHTML("beforeend", `<div class="generated-id full"><strong>Assigned Registration Number</strong><span>${result.sacco.registrationNumber}</span><button class="glass-link" type="button" data-download-email="${result.sacco.registrationNumber}">Download email copy</button></div>`);
    return;
  } catch (error) {
    if (!location.protocol.startsWith("file")) {
      showToast(error.message);
      return;
    }
  }
  const registration = nextSaccoRegistration();
  lastSaccoRegistration = registration;
  const ownerName = String(data.get("owner_name"));
  const ownerEmail = String(data.get("owner_email"));
  const ownerPassword = String(data.get("password"));
  adminAccounts.unshift({
    name: ownerName,
    email: ownerEmail,
    password: ownerPassword,
    memberName: ownerName,
    memberPassword: ownerPassword,
  });
  memberAccounts.unshift({
    name: ownerName,
    memberId: `ZS-${1000 + memberAccounts.length + 1}`,
    saccoRegistration: registration,
    password: ownerPassword,
  });
  const emailBody = `Z-SACCO Account Details

SACCO Name: ${data.get("sacco_name")}
SACCO Registration Number: ${registration}
SACCO Phone: ${data.get("sacco_phone")}
SACCO Email: ${data.get("sacco_email")}
Main Branch: ${data.get("location")}
Members: ${data.get("members_count")}

Owner/Admin Name: ${data.get("owner_name")}
Owner/Admin Phone: ${data.get("owner_phone")}
Owner/Admin Email: ${data.get("owner_email")}

Important:
- This is the main SACCO owner/admin account.
- SACCO members should receive limited member portal access only.
- Each member should set a private member password.
- Members can log in with the SACCO registration number, member ID, or registered member name plus their password.
- The owner/admin can also access the member portal because they are part of this SACCO.`;
  showToast(`Account created. Details sent to ${data.get("owner_email")} with registration ${registration}.`);
  form.querySelector(".generated-id")?.remove();
  form.insertAdjacentHTML("beforeend", `<div class="generated-id full"><strong>Assigned Registration Number</strong><span>${registration}</span><button class="glass-link" type="button" data-download-email="${registration}">Download email copy</button></div>`);
  form.dataset.emailBody = emailBody;
}

document.addEventListener("click", (event) => {
  const screenButton = event.target.closest("[data-screen]");
  const memberScreenButton = event.target.closest("[data-member-screen]");
  const switchButton = event.target.closest("[data-switch]");
  const transactionButton = event.target.closest("[data-post-transaction]");
  const saveMemberButton = event.target.closest("[data-save-member]");
  const submitLoanButton = event.target.closest("[data-submit-loan]");
  const loanDecisionButton = event.target.closest("[data-loan-decision]");
  const downloadButton = event.target.closest("[data-download]");
  const tableAction = event.target.closest(".table-action");
  const authTabButton = event.target.closest("[data-auth-tab]");
  const openAppButton = event.target.closest("[data-open-app]");
  const scrollButton = event.target.closest("[data-scroll-target]");
  const featureCard = event.target.closest("[data-feature]");
  const emailDownloadButton = event.target.closest("[data-download-email]");
  const loginRoleButton = event.target.closest("[data-login-role]");
  const loginSubmitButton = event.target.closest("[data-login-submit]");
  const forgotPasswordButton = event.target.closest("[data-forgot-password]");
  const logoutButton = event.target.closest("[data-logout]");
  const generateMemberPasswordButton = event.target.closest("[data-generate-member-password]");
  const uploadKycButton = event.target.closest("[data-upload-kyc]");
  const removeKycButton = event.target.closest("[data-remove-kyc]");
  const togglePasswordButton = event.target.closest("[data-toggle-password]");
  if (openAppButton) openSystemAuth(openAppButton.dataset.openApp);
  if (scrollButton) scrollToSection(scrollButton.dataset.scrollTarget);
  if (featureCard) setFeatureDetail(featureCard);
  if (loginRoleButton) chooseLoginRole(loginRoleButton.dataset.loginRole);
  if (loginSubmitButton) loginAsRole(loginSubmitButton.dataset.loginSubmit, loginSubmitButton);
  if (forgotPasswordButton) forgotPassword(forgotPasswordButton.dataset.forgotPassword, forgotPasswordButton);
  if (logoutButton) logout();
  if (togglePasswordButton) {
    const input = togglePasswordButton.closest(".password-control")?.querySelector("input");
    if (input) {
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      togglePasswordButton.innerHTML = showing ? icons.eye : icons.eyeOff;
      togglePasswordButton.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      togglePasswordButton.setAttribute("aria-pressed", String(!showing));
    }
  }
  if (generateMemberPasswordButton) {
    const input = generateMemberPasswordButton.closest(".password-input-group")?.querySelector('[name="password"]');
    if (input) {
      input.type = "text";
      input.value = generateSecurePassword();
      const toggle = input.closest(".password-control")?.querySelector("[data-toggle-password]");
      if (toggle) {
        toggle.innerHTML = icons.eyeOff;
        toggle.setAttribute("aria-label", "Hide password");
        toggle.setAttribute("aria-pressed", "true");
      }
      showToast("Secure member password generated.");
    }
  }
  if (uploadKycButton) {
    uploadKycButton.closest("form")?.querySelector("[data-kyc-file-input]")?.click();
  }
  if (removeKycButton) {
    const form = removeKycButton.closest("form");
    uploadedKycDocuments.splice(Number(removeKycButton.dataset.removeKyc), 1);
    renderKycPreview(form);
  }
  if (screenButton) {
    if (screenButton.dataset.screen === "memberForm") editingMember = null;
    setAdminScreen(screenButton.dataset.screen);
  }
  if (memberScreenButton) setMemberScreen(memberScreenButton.dataset.memberScreen);
  if (authTabButton) setAuthMode(authTabButton.dataset.authTab, authTabButton);
  if (transactionButton) postTransaction(transactionButton.dataset.postTransaction, transactionButton);
  if (saveMemberButton) saveMember(saveMemberButton);
  if (submitLoanButton) submitLoan(submitLoanButton);
  if (loanDecisionButton) decideLoan(loanDecisionButton.dataset.loanDecision);
  if (event.target.closest("[data-print-receipt]")) downloadFile("z-sacco-receipt.txt", `Z-SACCO Receipt\nGenerated: ${todayLabel()}\nReference: ${selectedTransaction[0]}\nMember: ${selectedTransaction[1]}\nAmount: ${selectedTransaction[3]}`);
  if (event.target.closest("[data-attach-documents]")) showToast("Loan documents attached to the application package.");
  if (event.target.closest("[data-support]")) showToast("Support request submitted. A Z-SACCO officer will follow up.");
  if (event.target.closest("[data-create-access]")) createSaccoAccount(event.target.closest("[data-create-access]"));
  if (emailDownloadButton) {
    const form = emailDownloadButton.closest("form");
    downloadFile(`${emailDownloadButton.dataset.downloadEmail}-account-email.txt`, form.dataset.emailBody || "Z-SACCO account details");
  }
  if (downloadButton) {
    if (downloadButton.dataset.download === "member-statement") {
      const memberTransactions = memberPortalRecords().transactions;
      const memberCsv = [
        "Reference,Type,Amount,Date,Status",
        ...memberTransactions.map((item) => [item.reference, item.transactionType, item.amount, item.date, item.status].join(",")),
      ].join("\n");
      downloadFile("z-sacco-member-statement.csv", memberCsv, "text/csv");
      return;
    }
    const csv = ["Reference,Member,Type,Amount,Date,Status", ...transactions.map((row) => row.join(","))].join("\n");
    const totalSavings = accountRecords.reduce((sum, account) => sum + Number(account.balance || 0), 0);
    const loanPortfolio = loanRecords.reduce((sum, loan) => sum + Number(loan.approvedAmount || loan.requestedAmount || 0), 0);
    const report = `Z-SACCO Financial Summary\nGenerated: ${todayLabel()}\nSACCO: ${liveSacco?.name || "Z-SACCO"}\nTotal Members: ${members.length}\nNet Savings: ${formatUGX(totalSavings)}\nLoan Portfolio: ${formatUGX(loanPortfolio)}\nTransactions: ${transactions.length}`;
    if (downloadButton.dataset.download === "financial-summary") downloadFile("z-sacco-financial-summary.txt", report);
    else downloadFile("z-sacco-transactions.csv", csv, "text/csv");
  }
  if (tableAction) {
    const values = tableRowValues(tableAction);
    const label = tableAction.innerText.trim().toLowerCase();
    if (label === "details" || label === "view" || label === "open") {
      if (values[0]?.startsWith("TX-")) {
        selectedTransaction = transactions.find((row) => row[0] === values[0]) || values;
        showToast(`Opened transaction ${selectedTransaction[0]}.`);
        if (!appFrame.classList.contains("hidden")) setAdminScreen("transactions");
      } else if (values[0]?.startsWith("LN-")) {
        selectedLoan = loanRows.find((row) => row[0] === values[0]) || values;
        setAdminScreen("loanDetails");
      } else if (values[0]?.startsWith("ZS-")) {
        selectedMember = memberRecords.find((member) => member.memberNumber === values[0]) || values.record || null;
        showToast(`Opened ${values[1]}'s member profile.`);
        setAdminScreen("memberProfile");
      } else {
        showToast(`${tableAction.innerText.trim()} action completed.`);
      }
    }
    if (label === "decide") {
      selectedLoan = loanRows.find((row) => row[0] === values[0]) || values;
      setAdminScreen("loanDetails");
    }
    if (label === "download") downloadFile(`${values[0].toLowerCase()}-statement.txt`, `Z-SACCO Statement\nStatement: ${values[0]}\nMember: ${values[1]}\nPeriod: ${values[2]}\nBalance: ${values[3]}`);
    if (label === "edit") {
      if (values[0]?.startsWith("ZS-")) {
        editingMember = memberRecords.find((member) => member.memberNumber === values[0]) || values.record || null;
        if (editingMember) setAdminScreen("memberForm");
        else showToast("This member record could not be opened.");
      } else {
        showToast(`${values[0]} role opened for editing.`);
      }
    }
  }
  if (switchButton) {
    guardedSwitch(switchButton.dataset.switch);
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("#tableSearch")) filterTable(event.target);
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-kyc-file-input]")) addKycFiles(event.target);
});

document.addEventListener("submit", (event) => {
  if (!event.target.matches(".contact-form")) return;
  event.preventDefault();
  const button = event.target.querySelector("[data-contact-submit]");
  if (button && !button.disabled) submitContactForm(button);
});

document.addEventListener("mouseover", (event) => {
  const featureCard = event.target.closest("[data-feature]");
  if (featureCard) setFeatureDetail(featureCard);
});

document.querySelector("#menuButton").addEventListener("click", () => appFrame.classList.toggle("menu-open"));

const siteSections = [...document.querySelectorAll(".public-site main section[id]")];
const siteLinks = [...document.querySelectorAll("[data-site-link]")];

function updateActiveSiteLink() {
  if (publicSite.classList.contains("hidden")) return;
  const current = siteSections.reduce((active, section) => {
    const top = section.getBoundingClientRect().top;
    return top <= 140 ? section : active;
  }, siteSections[0]);
  siteLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current?.id}`));
}

window.addEventListener("scroll", updateActiveSiteLink, { passive: true });

setAdminScreen("adminLogin");
setMemberScreen("memberDashboard");
updateActiveSiteLink();
