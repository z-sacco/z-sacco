const assert = require("assert/strict");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const port = 3197;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "zsacco-test-"));
const server = spawn(process.execPath, [path.join(__dirname, "..", "server.js")], {
  env: { ...process.env, PORT: String(port), DATA_BACKEND: "local", DATA_PATH: path.join(tempDir, "db.json") },
  stdio: ["ignore", "pipe", "pipe"],
});

async function request(route, payload) {
  const options = payload === undefined ? {} : {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  };
  options.signal = AbortSignal.timeout(1000);
  const response = await fetch(`http://127.0.0.1:${port}${route}`, options);
  const body = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${body.error}`);
  return body;
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { return await request("/api/health"); } catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
  }
  throw new Error("Test server did not start.");
}

(async () => {
  await waitForServer();
  const registration = await request("/api/saccos", {
    saccoName: "Test Cooperative", saccoPhone: "+256700100200", saccoEmail: "office@test.example",
    location: "Kampala", memberCount: "10", ownerName: "Test Owner", ownerPhone: "+256700100201",
    ownerEmail: "owner@test.example", password: "StrongPass12!", confirmPassword: "StrongPass12!",
  });
  const login = await request("/api/auth/login", { role: "admin", email: "owner@test.example", password: "StrongPass12!" });
  let data = await request("/api/members", {
    token: login.token, name: "New Member", phone: "+256700100202", email: "member@test.example",
    branch: "Kampala", nationalId: "CM123", memberType: "Individual", address: "Kampala",
    password: "MemberPass12!", temporaryPassword: "MemberPass12!",
  });
  const member = data.members.find((item) => item.email === "member@test.example");
  const account = data.accounts.find((item) => item.memberId === member.id);
  assert.ok(account, "New members receive a savings account");
  data = await request("/api/transactions", { token: login.token, accountId: account.id, transactionType: "Deposit", amount: 250000, method: "Cash" });
  assert.equal(data.accounts.find((item) => item.id === account.id).balance, 250000);
  data = await request("/api/transactions", { token: login.token, accountId: account.id, transactionType: "Withdrawal", amount: 50000, method: "Cash" });
  assert.equal(data.accounts.find((item) => item.id === account.id).balance, 200000);
  data = await request("/api/loans", { token: login.token, memberId: member.id, product: "Development Loan", amount: 1000000, term: 12, purpose: "Business" });
  const loan = data.loans.find((item) => item.memberId === member.id);
  data = await request("/api/loans/decision", { token: login.token, loanId: loan.id, decision: "approve" });
  assert.equal(data.loans.find((item) => item.id === loan.id).status, "Performing");
  const memberLogin = await request("/api/auth/login", { role: "member", identity: member.memberNumber, password: "MemberPass12!" });
  const memberData = await request("/api/app-data", { token: memberLogin.token });
  assert.equal(memberData.members.length, 1, "Members can only view their own data");
  assert.equal(memberData.summary.totalSavings, 200000);
  assert.equal(registration.sacco.name, "Test Cooperative");
  console.log("Integration checks passed: registration, auth, members, accounts, transactions, loans, persistence, and member scoping.");
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
}).finally(() => {
  server.kill("SIGTERM");
  fs.rmSync(tempDir, { recursive: true, force: true });
  setTimeout(() => process.exit(process.exitCode || 0), 100);
});
